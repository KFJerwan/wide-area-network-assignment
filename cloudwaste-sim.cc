#include "ns3/core-module.h"
#include "ns3/network-module.h"
#include "ns3/internet-module.h"
#include "ns3/mobility-module.h"
#include "ns3/lte-module.h"
#include "ns3/point-to-point-module.h"
#include "ns3/applications-module.h"
#include "ns3/animation-interface.h"
#include <iostream>
#include <string>

using namespace ns3;

int main(int argc, char *argv[]) {
  std::cout << "===== CloudWaste Yaoundé LTE Simulation STARTED! =====" << std::endl;

  LogComponentEnable("UdpEchoClientApplication", LOG_LEVEL_INFO);
  LogComponentEnable("UdpEchoServerApplication", LOG_LEVEL_INFO);

  Ptr<LteHelper> lteHelper = CreateObject<LteHelper>();
  Ptr<PointToPointEpcHelper> epcHelper = CreateObject<PointToPointEpcHelper>();
  lteHelper->SetEpcHelper(epcHelper);

  Ptr<Node> pgw = epcHelper->GetPgwNode();

  NodeContainer remoteHostContainer;
  remoteHostContainer.Create(1);
  Ptr<Node> remoteHost = remoteHostContainer.Get(0);

  InternetStackHelper internet;
  internet.Install(remoteHostContainer);

  PointToPointHelper p2ph;
  p2ph.SetDeviceAttribute("DataRate", DataRateValue(DataRate("100Gb/s")));
  p2ph.SetChannelAttribute("Delay", TimeValue(Seconds(0.010)));
  NetDeviceContainer internetDevices = p2ph.Install(pgw, remoteHost);

  Ipv4AddressHelper ipv4h;
  ipv4h.SetBase("1.0.0.0", "255.0.0.0");
  Ipv4InterfaceContainer internetIpIfaces = ipv4h.Assign(internetDevices);
  Ipv4Address remoteHostAddr = internetIpIfaces.GetAddress(1);

  Ipv4StaticRoutingHelper ipv4RoutingHelper;
  Ptr<Ipv4StaticRouting> remoteHostStaticRouting = ipv4RoutingHelper.GetStaticRouting(remoteHost->GetObject<Ipv4>());
  remoteHostStaticRouting->AddNetworkRouteTo(Ipv4Address("7.0.0.0"), Ipv4Mask("255.0.0.0"), 1);

  NodeContainer enbNodes;
  enbNodes.Create(1);

  NodeContainer ueNodes;
  ueNodes.Create(20);

  MobilityHelper mobility;
  mobility.SetMobilityModel("ns3::ConstantPositionMobilityModel");
  mobility.Install(enbNodes);
  enbNodes.Get(0)->GetObject<MobilityModel>()->SetPosition(Vector(250, 250, 30));

  mobility.SetPositionAllocator("ns3::RandomRectanglePositionAllocator",
                                "X", StringValue("ns3::UniformRandomVariable[Min=0.0|Max=500.0]"),
                                "Y", StringValue("ns3::UniformRandomVariable[Min=0.0|Max=500.0]"));
  mobility.Install(ueNodes);

  NetDeviceContainer enbDevs = lteHelper->InstallEnbDevice(enbNodes);
  NetDeviceContainer ueDevs = lteHelper->InstallUeDevice(ueNodes);

  internet.Install(ueNodes);

  Ipv4InterfaceContainer ueIpIface = epcHelper->AssignUeIpv4Address(NetDeviceContainer(ueDevs));

  for (uint32_t u = 0; u < ueNodes.GetN(); ++u) {
    lteHelper->Attach(ueDevs.Get(u), enbDevs.Get(0));
  }

  for (uint32_t u = 0; u < ueNodes.GetN(); ++u) {
    Ptr<Node> ueNode = ueNodes.Get(u);
    Ptr<Ipv4StaticRouting> ueStaticRouting = ipv4RoutingHelper.GetStaticRouting(ueNode->GetObject<Ipv4>());
    ueStaticRouting->SetDefaultRoute(epcHelper->GetUeDefaultGatewayAddress(), 1);
  }

  uint16_t port = 9;
  UdpEchoServerHelper echoServer(port);
  ApplicationContainer serverApps = echoServer.Install(remoteHost);
  serverApps.Start(Seconds(1.0));
  serverApps.Stop(Seconds(60.0));

  for (uint32_t i = 0; i < ueNodes.GetN(); ++i) {
    UdpEchoClientHelper echoClient(remoteHostAddr, port);
    echoClient.SetAttribute("MaxPackets", UintegerValue(20));
    echoClient.SetAttribute("Interval", TimeValue(Seconds(2.0)));
    echoClient.SetAttribute("PacketSize", UintegerValue(512));
    ApplicationContainer clientApps = echoClient.Install(ueNodes.Get(i));
    clientApps.Start(Seconds(2.0 + i * 0.2));
    clientApps.Stop(Seconds(60.0));
  }

  AnimationInterface anim("cloudwaste-lte-sim.xml");
  anim.EnablePacketMetadata(true);

  anim.UpdateNodeDescription(pgw, "PGW");
  anim.UpdateNodeDescription(remoteHost, "Cloud Server");
  anim.UpdateNodeDescription(enbNodes.Get(0), "eNB (Base Station)");
  anim.UpdateNodeColor(remoteHost, 0, 0, 255);
  anim.UpdateNodeColor(enbNodes.Get(0), 255, 0, 0);
  for (uint32_t i = 0; i < ueNodes.GetN(); ++i) {
    anim.UpdateNodeDescription(ueNodes.Get(i), "Bin " + std::to_string(i + 1));
    anim.UpdateNodeColor(ueNodes.Get(i), 0, 255, 0);
  }

  Simulator::Stop(Seconds(60.0));
  Simulator::Run();
  std::cout << "===== Simulation COMPLETED successfully! =====" << std::endl;
  Simulator::Destroy();

  return 0;
}
