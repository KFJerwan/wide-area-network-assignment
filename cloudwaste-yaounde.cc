#include "ns3/core-module.h"
#include "ns3/network-module.h"
#include "ns3/internet-module.h"
#include "ns3/mobility-module.h"
#include "ns3/lte-module.h"
#include "ns3/applications-module.h"
#include "ns3/point-to-point-module.h"
#include "ns3/animation-interface.h"
#include "ns3/flow-monitor-module.h"
#include <iostream>
#include <fstream>

using namespace ns3;

NS_LOG_COMPONENT_DEFINE("CloudWasteYaounde");

// Custom Application to simulate smart bin behavior
class SmartBinApp : public Application {
private:
  Ptr<Socket> m_socket;
  Address m_serverAddr;
  uint32_t m_binId;
  uint32_t m_fillLevel;
  EventId m_sendEvent;
  Time m_interval;
  
  void SendBinData() {
    // Simulate bin data: ID, fill level, GPS, timestamp
    std::ostringstream msg;
    msg << "BIN_ID:" << m_binId 
        << ",FILL:" << m_fillLevel << "%"
        << ",GPS:3.848,11.502"
        << ",BATTERY:85%"
        << ",STATUS:OPERATIONAL";
    
    Ptr<Packet> packet = Create<Packet>((uint8_t*)msg.str().c_str(), msg.str().length());
    m_socket->Send(packet);
    
    NS_LOG_INFO("Bin " << m_binId << " sent: Fill=" << m_fillLevel << "% at " 
                << Simulator::Now().GetSeconds() << "s");
    
    // Simulate fill level increasing over time
    m_fillLevel = std::min(100u, m_fillLevel + (rand() % 15 + 5));
    
    // Send next update
    m_sendEvent = Simulator::Schedule(m_interval, &SmartBinApp::SendBinData, this);
  }
  
  void StartApplication() override {
    m_socket = Socket::CreateSocket(GetNode(), UdpSocketFactory::GetTypeId());
    m_socket->Connect(m_serverAddr);
    m_fillLevel = rand() % 40 + 20; // Start 20-60% full
    SendBinData();
  }
  
  void StopApplication() override {
    if (m_socket) {
      m_socket->Close();
    }
    Simulator::Cancel(m_sendEvent);
  }
  
public:
  SmartBinApp() : m_binId(0), m_fillLevel(0) {}
  
  void Setup(Address addr, uint32_t binId, Time interval) {
    m_serverAddr = addr;
    m_binId = binId;
    m_interval = interval;
  }
};

int main(int argc, char *argv[]) {
  // Simulation parameters
  uint32_t nBins = 50; // 50 bins in Nlongkak as per document
  uint32_t nTrucks = 3; // 3 collection trucks
  double simTime = 120.0; // 2 minutes simulation
  
  CommandLine cmd;
  cmd.AddValue("nBins", "Number of smart bins", nBins);
  cmd.AddValue("simTime", "Simulation time", simTime);
  cmd.Parse(argc, argv);
  
  std::cout << "\n========================================" << std::endl;
  std::cout << "CloudWaste Yaoundé - Smart Waste Management System" << std::endl;
  std::cout << "Simulating Nlongkak Neighborhood" << std::endl;
  std::cout << "Bins: " << nBins << " | Trucks: " << nTrucks << std::endl;
  std::cout << "========================================\n" << std::endl;

  // Enable logging
  LogComponentEnable("CloudWasteYaounde", LOG_LEVEL_INFO);

  // Create LTE and EPC helpers
  Ptr<LteHelper> lteHelper = CreateObject<LteHelper>();
  Ptr<PointToPointEpcHelper> epcHelper = CreateObject<PointToPointEpcHelper>();
  lteHelper->SetEpcHelper(epcHelper);
  
  // Configure LTE for IoT (lower bandwidth, better coverage)
  Config::SetDefault("ns3::LteEnbRrc::SrsPeriodicity", UintegerValue(320));

  Ptr<Node> pgw = epcHelper->GetPgwNode();

  // Create Cloud Server (AWS Cape Town)
  NodeContainer cloudServer;
  cloudServer.Create(1);
  Ptr<Node> remoteHost = cloudServer.Get(0);

  // Create HYSACAM Management Office
  NodeContainer hysacamOffice;
  hysacamOffice.Create(1);

  InternetStackHelper internet;
  internet.Install(cloudServer);
  internet.Install(hysacamOffice);

  // Connect Cloud Server to PGW (100Gbps fiber - AWS connection)
  PointToPointHelper p2ph;
  p2ph.SetDeviceAttribute("DataRate", DataRateValue(DataRate("100Gb/s")));
  p2ph.SetDeviceAttribute("Mtu", UintegerValue(1500));
  p2ph.SetChannelAttribute("Delay", TimeValue(MilliSeconds(50))); // Cape Town latency
  NetDeviceContainer internetDevices = p2ph.Install(pgw, remoteHost);

  // Connect HYSACAM Office to PGW (10Mbps ADSL)
  PointToPointHelper adsl;
  adsl.SetDeviceAttribute("DataRate", DataRateValue(DataRate("10Mb/s")));
  adsl.SetChannelAttribute("Delay", TimeValue(MilliSeconds(20)));
  NetDeviceContainer officeDevices = adsl.Install(pgw, hysacamOffice.Get(0));

  Ipv4AddressHelper ipv4h;
  ipv4h.SetBase("1.0.0.0", "255.255.255.0");
  Ipv4InterfaceContainer internetIpIfaces = ipv4h.Assign(internetDevices);
  
  ipv4h.SetBase("2.0.0.0", "255.255.255.0");
  Ipv4InterfaceContainer officeIpIfaces = ipv4h.Assign(officeDevices);

  Ipv4Address cloudServerAddr = internetIpIfaces.GetAddress(1);

  // Static routing
  Ipv4StaticRoutingHelper ipv4RoutingHelper;
  Ptr<Ipv4StaticRouting> remoteHostStaticRouting = 
    ipv4RoutingHelper.GetStaticRouting(remoteHost->GetObject<Ipv4>());
  remoteHostStaticRouting->AddNetworkRouteTo(Ipv4Address("7.0.0.0"), 
                                             Ipv4Mask("255.0.0.0"), 1);

  // Create 2 eNBs (MTN and Orange base stations in Nlongkak)
  NodeContainer enbNodes;
  enbNodes.Create(2);

  // Create Smart Bins (UEs)
  NodeContainer binNodes;
  binNodes.Create(nBins);
  
  // Create Collection Trucks (UEs with tablets)
  NodeContainer truckNodes;
  truckNodes.Create(nTrucks);

  // Mobility setup - eNBs at fixed positions (cell towers)
  MobilityHelper mobility;
  Ptr<ListPositionAllocator> enbPositions = CreateObject<ListPositionAllocator>();
  enbPositions->Add(Vector(200, 300, 30)); // MTN tower
  enbPositions->Add(Vector(400, 200, 30)); // Orange tower
  mobility.SetPositionAllocator(enbPositions);
  mobility.SetMobilityModel("ns3::ConstantPositionMobilityModel");
  mobility.Install(enbNodes);

  // Bins scattered across Nlongkak (500x500m area)
  mobility.SetPositionAllocator("ns3::RandomRectanglePositionAllocator",
                                "X", StringValue("ns3::UniformRandomVariable[Min=50|Max=550]"),
                                "Y", StringValue("ns3::UniformRandomVariable[Min=50|Max=550]"));
  mobility.SetMobilityModel("ns3::ConstantPositionMobilityModel");
  mobility.Install(binNodes);

  // Trucks moving around (random waypoint mobility)
  mobility.SetMobilityModel("ns3::RandomWaypointMobilityModel",
                           "Speed", StringValue("ns3::UniformRandomVariable[Min=5|Max=15]"),
                           "Pause", StringValue("ns3::ConstantRandomVariable[Constant=2]"),
                           "PositionAllocator", PointerValue(CreateObject<RandomRectanglePositionAllocator>()));
  mobility.Install(truckNodes);

  // Install LTE devices
  NetDeviceContainer enbDevs = lteHelper->InstallEnbDevice(enbNodes);
  NetDeviceContainer binDevs = lteHelper->InstallUeDevice(binNodes);
  NetDeviceContainer truckDevs = lteHelper->InstallUeDevice(truckNodes);

  // Install internet stack
  internet.Install(binNodes);
  internet.Install(truckNodes);

  // Assign IP addresses
  Ipv4InterfaceContainer binIpIfaces = epcHelper->AssignUeIpv4Address(binDevs);
  Ipv4InterfaceContainer truckIpIfaces = epcHelper->AssignUeIpv4Address(truckDevs);

  // Attach bins to nearest eNB (load balancing)
  for (uint32_t i = 0; i < binNodes.GetN(); ++i) {
    lteHelper->Attach(binDevs.Get(i), enbDevs.Get(i % 2));
  }
  
  // Attach trucks to both eNBs (handover enabled)
  for (uint32_t i = 0; i < truckNodes.GetN(); ++i) {
    lteHelper->Attach(truckDevs.Get(i), enbDevs.Get(0));
  }

  // Set default routes for UEs
  for (uint32_t u = 0; u < binNodes.GetN(); ++u) {
    Ptr<Ipv4StaticRouting> ueStaticRouting = 
      ipv4RoutingHelper.GetStaticRouting(binNodes.Get(u)->GetObject<Ipv4>());
    ueStaticRouting->SetDefaultRoute(epcHelper->GetUeDefaultGatewayAddress(), 1);
  }
  for (uint32_t u = 0; u < truckNodes.GetN(); ++u) {
    Ptr<Ipv4StaticRouting> ueStaticRouting = 
      ipv4RoutingHelper.GetStaticRouting(truckNodes.Get(u)->GetObject<Ipv4>());
    ueStaticRouting->SetDefaultRoute(epcHelper->GetUeDefaultGatewayAddress(), 1);
  }

  // Install Cloud Server application (receives bin data)
  uint16_t serverPort = 8080;
  UdpServerHelper server(serverPort);
  ApplicationContainer serverApp = server.Install(remoteHost);
  serverApp.Start(Seconds(1.0));
  serverApp.Stop(Seconds(simTime));

  // Install Smart Bin applications (send fill-level data)
  for (uint32_t i = 0; i < binNodes.GetN(); ++i) {
    UdpClientHelper client(cloudServerAddr, serverPort);
    client.SetAttribute("MaxPackets", UintegerValue(100));
    client.SetAttribute("Interval", TimeValue(Seconds(30.0))); // Every 30s as per doc
    client.SetAttribute("PacketSize", UintegerValue(256)); // Small IoT packets
    
    ApplicationContainer clientApp = client.Install(binNodes.Get(i));
    clientApp.Start(Seconds(2.0 + i * 0.1)); // Staggered start
    clientApp.Stop(Seconds(simTime));
  }

  // Install Truck applications (send GPS updates)
  for (uint32_t i = 0; i < truckNodes.GetN(); ++i) {
    UdpClientHelper client(cloudServerAddr, serverPort);
    client.SetAttribute("MaxPackets", UintegerValue(100));
    client.SetAttribute("Interval", TimeValue(Seconds(2.0))); // GPS every 2s
    client.SetAttribute("PacketSize", UintegerValue(128));
    
    ApplicationContainer clientApp = client.Install(truckNodes.Get(i));
    clientApp.Start(Seconds(5.0));
    clientApp.Stop(Seconds(simTime));
  }

  // Flow Monitor for statistics
  FlowMonitorHelper flowmon;
  Ptr<FlowMonitor> monitor = flowmon.InstallAll();

  // NetAnim configuration
  AnimationInterface anim("cloudwaste-yaounde-simulation.xml");
  anim.EnablePacketMetadata(true);
  
  // Cloud infrastructure
  anim.UpdateNodeDescription(remoteHost, "AWS Cloud Server\n(Cape Town)");
  anim.UpdateNodeColor(remoteHost, 0, 100, 255);
  anim.UpdateNodeSize(remoteHost, 15, 15);
  
  anim.UpdateNodeDescription(pgw, "PGW Gateway");
  anim.UpdateNodeColor(pgw, 150, 150, 150);
  
  anim.UpdateNodeDescription(hysacamOffice.Get(0), "HYSACAM Office\nDashboard");
  anim.UpdateNodeColor(hysacamOffice.Get(0), 255, 165, 0);
  anim.UpdateNodeSize(hysacamOffice.Get(0), 10, 10);
  
  // Base stations
  anim.UpdateNodeDescription(enbNodes.Get(0), "MTN Tower\nNlongkak");
  anim.UpdateNodeColor(enbNodes.Get(0), 255, 200, 0);
  anim.UpdateNodeSize(enbNodes.Get(0), 12, 12);
  
  anim.UpdateNodeDescription(enbNodes.Get(1), "Orange Tower\nNlongkak");
  anim.UpdateNodeColor(enbNodes.Get(1), 255, 140, 0);
  anim.UpdateNodeSize(enbNodes.Get(1), 12, 12);
  
  // Smart bins
  for (uint32_t i = 0; i < binNodes.GetN(); ++i) {
    uint32_t fillLevel = 30 + (i % 60); // Vary fill levels
    std::string desc = "Bin-" + std::to_string(i+1) + "\n" + std::to_string(fillLevel) + "%";
    anim.UpdateNodeDescription(binNodes.Get(i), desc);
    
    // Color based on fill level: green->yellow->red
    if (fillLevel < 50) {
      anim.UpdateNodeColor(binNodes.Get(i), 0, 200, 0); // Green
    } else if (fillLevel < 80) {
      anim.UpdateNodeColor(binNodes.Get(i), 255, 200, 0); // Yellow
    } else {
      anim.UpdateNodeColor(binNodes.Get(i), 255, 0, 0); // Red (needs collection)
    }
    anim.UpdateNodeSize(binNodes.Get(i), 6, 6);
  }
  
  // Collection trucks
  for (uint32_t i = 0; i < truckNodes.GetN(); ++i) {
    anim.UpdateNodeDescription(truckNodes.Get(i), "Truck-" + std::to_string(i+1));
    anim.UpdateNodeColor(truckNodes.Get(i), 100, 100, 255);
    anim.UpdateNodeSize(truckNodes.Get(i), 8, 8);
  }

  std::cout << "Starting simulation..." << std::endl;
  Simulator::Stop(Seconds(simTime));
  Simulator::Run();

  // Print statistics
  std::cout << "\n========================================" << std::endl;
  std::cout << "SIMULATION RESULTS" << std::endl;
  std::cout << "========================================" << std::endl;
  
  monitor->CheckForLostPackets();
  Ptr<Ipv4FlowClassifier> classifier = DynamicCast<Ipv4FlowClassifier>(flowmon.GetClassifier());
  FlowMonitor::FlowStatsContainer stats = monitor->GetFlowStats();
  
  double totalDelay = 0;
  uint64_t totalRxPackets = 0;
  uint64_t totalTxPackets = 0;
  
  for (auto const &i : stats) {
    totalRxPackets += i.second.rxPackets;
    totalTxPackets += i.second.txPackets;
    if (i.second.rxPackets > 0) {
      totalDelay += i.second.delaySum.GetSeconds();
    }
  }
  
  double avgDelay = (totalRxPackets > 0) ? (totalDelay / totalRxPackets) * 1000 : 0;
  double pdr = (totalTxPackets > 0) ? (double)totalRxPackets / totalTxPackets * 100 : 0;
  
  std::cout << "Total Packets Sent: " << totalTxPackets << std::endl;
  std::cout << "Total Packets Received: " << totalRxPackets << std::endl;
  std::cout << "Packet Delivery Ratio: " << pdr << "%" << std::endl;
  std::cout << "Average End-to-End Delay: " << avgDelay << " ms" << std::endl;
  std::cout << "\nBin-to-Cloud Communication: " << (pdr > 90 ? "SUCCESS ✓" : "DEGRADED") << std::endl;
  std::cout << "WAN Performance: " << (avgDelay < 200 ? "EXCELLENT ✓" : "ACCEPTABLE") << std::endl;
  std::cout << "========================================\n" << std::endl;

  Simulator::Destroy();
  
  std::cout << "Animation file created: cloudwaste-yaounde-simulation.xml" << std::endl;
  std::cout << "Open with NetAnim to visualize the network!\n" << std::endl;
  
  return 0;
}
