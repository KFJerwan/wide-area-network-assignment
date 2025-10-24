# CloudWaste Yaoundé: Smart Waste Management System
## Practical Implementation Using Cloud Services and WAN Technology

**Student:** Feutseu Kenmogne Junior Erwan  
**Student ID:** ICTU20234174  
**Course:** Wide Area Networks  
**Community:** Nlongkak, Yaoundé, Cameroon  
**Submission Date:** October 24, 2025

---

## Introduction

Dear Lecturer,

I am presenting my solution to a critical problem I experience daily in my community of Nlongkak, Yaoundé. This project, CloudWaste Yaoundé, demonstrates how cloud computing and Wide Area Network technologies can transform waste management in our city. I have designed a complete, implementable system that I believe can genuinely improve life for residents while showcasing the practical applications of what we have learned in your WAN course.

---

## Table of Contents
1. [The Problem in My Community](#1-the-problem-in-my-community)
2. [Understanding Cloud Services and WAN](#2-understanding-cloud-services-and-wan)
3. [My Solution Design](#3-my-solution-design)
4. [Complete Implementation Plan](#4-complete-implementation-plan)
5. [Network Architecture Using WAN](#5-network-architecture-using-wan)
6. [How the System Works - Step by Step](#6-how-the-system-works-step-by-step)
7. [Practical Deployment in Nlongkak](#7-practical-deployment-in-nlongkak)
8. [Addressing Implementation Challenges](#8-addressing-implementation-challenges)
9. [Expected Benefits and Impact](#9-expected-benefits-and-impact)
10. [Conclusion](#10-conclusion)

---

## 1. The Problem in My Community

### 1.1 What I Observe Every Day in Nlongkak

Lecturer, I live in Nlongkak neighborhood here in Yaoundé, and every single day I witness the consequences of poor waste management. Allow me to describe what I see:

When I leave my house each morning to go to ICT University, I walk past at least three overflowing waste bins before I reach the main road. The bins are supposed to be emptied by HYSACAM on Tuesdays and Fridays, but frequently they skip our neighborhood for entire weeks. During these periods, garbage piles up on street corners, the smell becomes unbearable especially during hot weather, and I see rats and flies everywhere.

Near Nlongkak market where many of us buy food, there is an unauthorized dump site behind the church that has been growing for years. During rainy season, this waste washes into our drainage channels, contributing to flooding. I have personally seen children playing dangerously close to these waste piles, which deeply concerns me given the health risks of diseases like cholera and typhoid that we sometimes hear about in Yaoundé.

What frustrates me most is that when we try to contact HYSACAM to report these problems, there is no effective communication channel. The phone numbers we have rarely answer, and even when someone does answer, they simply tell us to "wait" without giving any specific information about when collection will happen.

### 1.2 Understanding the Root Cause

After observing this situation throughout my time living in Nlongkak, I have realized that the fundamental problem is not lack of effort by HYSACAM or insufficient trucks. The core issue is **absence of information and coordination**:

- HYSACAM operates on fixed schedules without knowing which bins are actually full
- They waste fuel visiting empty bins while missing overflowing ones
- Residents have no way to communicate problems or receive information
- Managers cannot track their vehicles or measure actual performance
- There is no data available for planning better routes or resource allocation
- Accountability is impossible because nothing is documented digitally

This is precisely the type of problem that cloud services and WAN technology are designed to solve, which is why I chose this project for your course.

### 1.3 Why This Problem Matters

Lecturer, this is not just about inconvenience or aesthetics. Poor waste management affects multiple aspects of our lives:

**Public Health:** Accumulated waste breeds disease vectors. Yaoundé has experienced cholera outbreaks partly due to contaminated water from waste-blocked drainage.

**Environmental Impact:** Unmanaged waste pollutes our Mfoundi River, contaminates soil, and produces methane gas contributing to climate change.

**Economic Effects:** Neighborhoods with visible waste problems experience declining property values and reduced business activity.

**Quality of Life:** Living surrounded by garbage affects mental health and community dignity. Clean environment is a basic right.

By solving waste management, we improve health, protect environment, support economic development, and enhance quality of life for over 2 million Yaoundé residents.

---

## 2. Understanding Cloud Services and WAN

Before I explain my implementation, let me clearly demonstrate my understanding of the core technologies, as this is central to your course.

### 2.1 Cloud Services - What They Are and How They Work

**My Definition:**
Cloud services are computing resources—including storage, processing power, databases, and applications—delivered over the internet rather than running on local computers or servers. Instead of owning physical infrastructure, organizations rent these resources from cloud providers like Amazon Web Services (AWS), Microsoft Azure, or Google Cloud Platform.

**Real-World Examples That Affect My Daily Life:**

*Example 1 - WhatsApp:*
When I send a message on WhatsApp to my classmate, I am not storing that conversation on my phone permanently. My phone sends the message through the internet to WhatsApp's servers located in data centers (the cloud). Those servers store all messages and deliver them to recipients. This is why I can access my entire WhatsApp history from any device where I log in—the data lives in the cloud, not on my device. My phone only needs a small 80MB application to access unlimited message history.

*Example 2 - Google Docs for Schoolwork:*
When I write assignments using Google Docs, I am not running word processing software on my laptop. Google's servers in the cloud are running the application, and my laptop simply displays the interface through my browser. This means I can start an assignment at home on my laptop, continue it at a cybercafé on a different computer, and finish it at ICT University on a school computer—all my work is automatically synchronized through the cloud. If my laptop breaks, I lose nothing because the document exists in Google's cloud infrastructure.

*Example 3 - Mobile Money Services:*
When I use Orange Money or MTN Mobile Money, all my transaction history is stored in the cloud servers of those companies. Orange does not install servers in every neighborhood. They have centralized cloud infrastructure that serves millions of customers. When I send money from Nlongkak to someone in Douala, the transaction is processed in the cloud and reflected instantly.

**Why Cloud Services Are Perfect for My Waste Management Project:**

1. **Low Initial Cost:** HYSACAM does not need to invest 50 million CFA in servers and IT infrastructure. They pay approximately 2 million CFA per year for cloud services.

2. **Accessibility:** Managers in the office, drivers in trucks, field supervisors in different neighborhoods, and citizens at home all access the same data in real-time through the internet.

3. **Scalability:** When we start with 50 bins in Nlongkak and later expand to 5,000 bins across all of Yaoundé, the cloud infrastructure automatically scales without requiring new hardware purchases.

4. **Reliability:** If one server fails, cloud providers have automatic backups and redundancy. Our system stays online even during power outages in Yaoundé because the servers are in professional data centers with backup power.

5. **Automatic Updates:** When I improve the software or fix problems, I update it once in the cloud and all users immediately have the improved version without downloading anything.

6. **Data Security:** Cloud providers maintain professional security, encryption, and backup systems that would be too expensive for HYSACAM to implement themselves.

### 2.2 Wide Area Network (WAN) - Core Concept and Application

**My Definition:**
A Wide Area Network is a telecommunications network that extends over large geographical areas, connecting multiple local networks and devices across cities, countries, or even continents. Unlike Local Area Networks (LAN) which connect devices within a single building, WAN enables communication across vast distances.

**Real-World Examples I Experience:**

*Example 1 - ATM Withdrawals:*
When I use an ATM machine here in Nlongkak to withdraw money from my bank account that I opened in Bafoussam, the ATM must connect through a WAN to my bank's central server in Bafoussam to verify my balance and authorize the transaction. This happens in seconds across hundreds of kilometers.

*Example 2 - Phone Calls Between Cities:*
When I call my family in Bamenda from Yaoundé, my voice is transmitted through MTN's WAN infrastructure that connects their cell towers across Cameroon. The WAN carries my voice signal from Yaoundé through the network to Bamenda.

*Example 3 - Mobile Internet Access:*
When I browse Facebook on my phone using MTN mobile data, my phone connects through MTN's cellular WAN to Facebook's servers which may be located in another country entirely. The WAN makes this seamless.

**WAN Technologies I Will Use in My Project:**

1. **Cellular Networks (3G/4G/LTE):**
   - MTN, Orange, and Camtel already provide cellular WAN coverage across Yaoundé
   - Smart bins will use SIM cards to send data through these networks
   - Collection trucks will transmit GPS location via cellular WAN
   - Citizens' mobile apps will communicate through cellular or WiFi networks

2. **Internet Backbone:**
   - HYSACAM headquarters will use fiber optic or ADSL internet connections
   - These connect to the global internet backbone reaching cloud servers

3. **GPS Satellite Network:**
   - GPS satellites form a WAN providing location data
   - Both smart bins and collection vehicles use GPS for positioning

4. **SMS Gateway:**
   - For users without smartphones, SMS provides a WAN communication channel
   - Works on even the most basic mobile phones

**Why WAN is Essential for My Solution:**

My CloudWaste system has components spread across the entire city:
- Smart bins in Nlongkak, Bastos, Mvan, Mokolo, Emana, and all other neighborhoods
- Collection trucks moving throughout Yaoundé
- HYSACAM headquarters in one location
- Thousands of citizens using mobile apps from their homes
- Cloud servers located in AWS Africa data center in South Africa

Without WAN technology, these geographically dispersed components could never communicate. WAN is the nervous system that connects everything together, enabling real-time data flow from any location in Yaoundé to the cloud and back.

---

## 3. My Solution Design

### 3.1 Complete System Overview

Lecturer, my CloudWaste Yaoundé system consists of three integrated components:

**Component 1: Smart Waste Bins with IoT Sensors**
Physical waste bins equipped with sensors that automatically detect fill levels and communicate this data through WAN to the cloud platform. These bins are strategically placed throughout Yaoundé, forming a network of intelligent collection points.

**Component 2: Cloud-Based Management Platform**
Software hosted in the cloud (AWS) that receives data from all bins, processes information, optimizes collection routes, manages citizen reports, tracks vehicles, and provides analytics to HYSACAM management. This is the brain of the system.

**Component 3: User Interfaces for All Stakeholders**
- Mobile application for citizens to report problems and receive information
- Web dashboard for HYSACAM managers to monitor and control operations
- Tablet application for truck drivers to receive instructions and log collections
- SMS interface for citizens with basic phones

### 3.2 How Information Flows Through the System

Let me trace the complete information flow to demonstrate how cloud and WAN work together:

**Step 1 - Data Generation at the Edge:**
A smart bin in Nlongkak market continuously monitors its fill level using an ultrasonic distance sensor. When the sensor detects that waste has reached 80% capacity, it triggers a data transmission.

**Step 2 - WAN Transmission to Cloud:**
The bin's embedded computer generates a data packet containing: bin identification number, current fill percentage, GPS coordinates, timestamp, and battery status. This packet is sent via SMS or mobile data through MTN's cellular WAN network to our cloud server hosted on AWS.

**Step 3 - Cloud Processing:**
The AWS server receives the data packet, authenticates it, stores it in the PostgreSQL database, and triggers the route optimization algorithm. The algorithm analyzes:
- Which other bins in the area are also full or nearly full
- Current location of all HYSACAM collection vehicles (tracked via GPS through WAN)
- Traffic patterns and road conditions
- Vehicle capacity and current load
- Driver working hours and schedules

**Step 4 - Intelligent Decision Making:**
The cloud system calculates the optimal collection route that includes this bin plus other nearby full bins, minimizing total distance traveled and fuel consumption. It assigns this route to the most appropriate vehicle.

**Step 5 - WAN Transmission to Field:**
The optimized route with turn-by-turn navigation is sent from the cloud through the cellular WAN network to the assigned truck's tablet device. The driver receives a notification with the route and estimated collection time.

**Step 6 - Field Execution:**
The driver follows the route on the tablet's map application. Upon arriving at each bin, the driver scans a QR code on the bin using the tablet's camera, which logs the collection with GPS-verified location and timestamp.

**Step 7 - Confirmation Loop:**
The collection confirmation is sent back through WAN to the cloud, which updates the database marking the bin as "collected" and records the successful completion. The bin's sensor detects it is now empty and reports this status, completing the cycle.

**Step 8 - Continuous Monitoring:**
This entire process runs continuously, 24/7, with all bins reporting status at regular intervals and collections happening based on actual need rather than fixed schedules.

### 3.3 What Makes My Solution Different

**Traditional HYSACAM System:**
- Fixed routes: "Visit every neighborhood on predetermined days regardless of need"
- No real-time data: Management does not know bin status until physically visited
- One-way operation: Trucks follow schedule, citizens have no input
- Resource waste: Empty bins visited, full bins missed
- No accountability: Cannot verify if collection actually occurred
- Manual planning: Routes based on experience, not data optimization

**My CloudWaste System:**
- Dynamic routing: "Collect where needed based on real-time data"
- Complete visibility: Every bin's status visible on cloud dashboard
- Two-way communication: Citizens report issues, system responds
- Optimized efficiency: Resources directed where most needed
- Full accountability: Every action logged with time, location, photographic proof
- Automated optimization: AI algorithms calculate best routes continuously

---

## 4. Complete Implementation Plan

Lecturer, let me now explain exactly how I would implement this system step-by-step over three months, as this will be my laboratory exercise for your course.

### 4.1 Month 1 - Preparation and Foundation

**Week 1: Stakeholder Engagement**

*Day 1-2: HYSACAM Partnership Meeting*
I will prepare a presentation demonstrating:
- Current inefficiencies in their operations
- How similar systems work in cities like Barcelona and Seoul
- Projected cost savings from route optimization
- Return on investment calculations
I will request their cooperation for the pilot project and access to their operational data.

*Day 3-4: Community Engagement*
I will organize a meeting in Nlongkak with:
- Neighborhood chief
- Local business owners near the market
- Resident representatives
I will explain the benefits and request their participation in testing the citizen reporting app.

*Day 5: Mobile Network Operator Negotiations*
I will contact MTN and Orange Cameroon to negotiate:
- Bulk SIM card purchases at discounted rates for IoT devices
- Affordable data plans for smart bins (approximately 100 MB per bin per month)
- Potential partnership where they gain positive publicity for supporting environmental technology

**Week 2: Technical Planning and Site Survey**

I will conduct a comprehensive survey of Nlongkak:
- Walk every major street with GPS device recording coordinates
- Identify optimal locations for 50 smart bins based on:
  - High foot traffic areas (market, schools, churches)
  - Current problematic locations with overflow issues
  - Strategic positions providing good neighborhood coverage
  - Locations with adequate mobile network signal strength
- Take photographs of current conditions for before/after comparison
- Map existing HYSACAM collection routes by following trucks for several days
- Interview truck drivers about challenges they face

**Week 3: Cloud Infrastructure Setup**

*AWS Account Configuration:*
1. Create AWS account using ICT University student credits (AWS Educate program provides free credits)
2. Set up Identity and Access Management (IAM) with proper security roles
3. Choose AWS Cape Town region for lowest latency to Cameroon

*Server Deployment:*
1. Launch EC2 virtual server instance (Ubuntu Linux, t3.medium size)
2. Install and configure web server (Nginx)
3. Install database system (PostgreSQL)
4. Configure security groups allowing only necessary ports (80 for HTTP, 443 for HTTPS, 22 for SSH)
5. Set up Elastic IP address for permanent server address
6. Configure automatic daily backups

*Database Design:*
I will create the following database tables:
- Bins: stores all smart bin information (ID, location coordinates, installation date, hardware version)
- SensorData: stores all sensor readings (bin ID, fill level, temperature, timestamp, battery voltage)
- Collections: logs every collection event (bin ID, truck ID, driver ID, collection timestamp, confirmation photo)
- Reports: stores citizen reports (reporter ID, bin ID, description, photo URL, report timestamp, resolution status)
- Trucks: tracks all HYSACAM vehicles (truck ID, license plate, GPS location updated every 2 minutes, current route assignment)
- Users: manages all system users (citizens, drivers, managers with different permission levels)

*Storage Configuration:*
1. Create Amazon S3 bucket for storing photos from citizen reports
2. Set up lifecycle policy to delete photos older than 1 year automatically
3. Configure CloudFront CDN for fast photo delivery to mobile apps

**Week 4: Application Development Begins**

*Mobile App Development:*
I will develop a cross-platform mobile application using React Native framework, which allows me to write code once and deploy to both Android and iOS. The app will have these screens:

1. **Splash Screen:** CloudWaste logo displayed while app loads
2. **Registration/Login:** Users register with phone number, receive SMS verification code
3. **Home Screen - Map View:** Interactive map showing:
   - User's current location (blue dot)
   - All bins in area (color-coded: green=empty, yellow=half-full, red=full)
   - Illegal dump sites reported by community
   - "Report Problem" button prominently displayed
4. **Report Screen:** 
   - Camera button to take photo of problem
   - GPS auto-captures exact location
   - Drop-down menu selecting issue type (overflowing bin, illegal dump, missed collection, broken bin)
   - Text field for description
   - Submit button
5. **My Reports Screen:** Shows all reports user has submitted with current status (received, in progress, resolved)
6. **Notifications Screen:** Displays alerts about collections in user's neighborhood
7. **Settings Screen:** User profile, language selection (French/English), notification preferences

*Web Dashboard Development:*
I will create a web-based management dashboard using React framework that HYSACAM managers access through any web browser. The dashboard will include:

1. **Live Operations Map:** Full-screen map showing:
   - Real-time positions of all trucks (moving icons)
   - All bins with current fill levels
   - All pending citizen reports
   - Clicking any icon shows details
2. **Alert Panel:** Priority-sorted list of items requiring attention (overflowing bins, urgent citizen reports, truck maintenance needed)
3. **Route Optimization Tool:** Interface where manager selects multiple full bins and system calculates optimal collection route, showing estimated time and fuel consumption
4. **Analytics Dashboard:** Charts and graphs showing:
   - Collections per day/week/month
   - Average response time to citizen reports
   - Fuel savings compared to previous month
   - Waste generation patterns by neighborhood and time
5. **Vehicle Management:** Table listing all trucks with current status, location, driver on duty, fuel level, maintenance schedule
6. **Report Review System:** Queue of citizen reports waiting for review, with options to assign to driver, mark as duplicate, or close as resolved

### 4.2 Month 2 - Hardware Development and Integration

**Week 1-2: Smart Bin Prototype Development**

I will build the first smart bin prototype at ICT University laboratory:

*Components Required Per Bin:*
1. Standard 240-liter plastic waste bin (purchase from local hardware store): 35,000 CFA
2. Ultrasonic distance sensor (HC-SR04 model): 5,000 CFA
3. Microcontroller board (Arduino Uno or ESP32): 15,000 CFA
4. GSM/GPRS module (SIM800L) with SIM card: 12,000 CFA
5. Solar panel 20W with charge controller: 25,000 CFA
6. 12V 7AH rechargeable lead-acid battery: 18,000 CFA
7. Waterproof project enclosure box: 15,000 CFA
8. GPS module (NEO-6M): 8,000 CFA
9. Cables, connectors, mounting brackets: 10,000 CFA
10. Installation labor and testing: 7,000 CFA

**Total per bin: 150,000 CFA (approximately $250 USD)**

*Assembly Process:*

Day 1-2: I will mount the ultrasonic sensor at the top inside the bin, pointing downward. This sensor works by sending ultrasonic sound waves and measuring how long they take to bounce back from the waste surface. By knowing the total depth of the bin (say 100cm) and measuring the distance to the waste surface (say 40cm), I can calculate that the bin is 60% full.

Day 3-4: I will install the microcontroller, GSM module, and GPS module inside the waterproof enclosure box. This box will be securely mounted on the exterior of the bin. All electrical connections will be carefully soldered and insulated.

Day 5-6: I will install the solar panel on top of the bin's lid using mounting brackets. The solar panel charges the battery during daytime, ensuring the system can operate even during Yaoundé's frequent power outages. The battery provides approximately 7 days of operation without any sun.

Day 7: I will program the microcontroller to read the sensor every 30 minutes, calculate fill percentage, and send data to the cloud if fill level exceeds 80% or if 6 hours have passed since last transmission (to verify the system is still functioning even when bin is not filling).

*Testing the Prototype:*

I will test the complete prototype in ICT University campus:
1. Verify sensor accurately measures fill level by adding and removing known volumes of waste
2. Confirm GSM module successfully sends data to cloud server
3. Test solar charging system by monitoring battery voltage over several days
4. Verify GPS provides accurate coordinates
5. Test system resilience by disconnecting power, blocking cellular signal, exposing to water spray

Once the prototype proves reliable, I will replicate this design to build 50 units.

**Week 3: Cloud Integration Testing**

I will thoroughly test the integration between hardware and cloud:

*Test Scenario 1: End-to-End Data Flow*
- Manually trigger the smart bin to send a "bin full" message
- Verify the message arrives at cloud server within 30 seconds
- Check that database correctly stores the data
- Confirm that dashboard displays updated bin status
- Test that alert is generated for HYSACAM managers

*Test Scenario 2: Multiple Simultaneous Bins*
- Trigger 10 smart bins to send data simultaneously
- Verify cloud server handles concurrent messages without data loss
- Ensure database maintains data integrity
- Check that dashboard updates properly with no errors

*Test Scenario 3: Network Interruption Handling*
- Disconnect one bin's mobile network connection
- Verify bin stores data locally
- Reconnect network
- Confirm bin transmits stored data once connection restored

**Week 4: Driver Tablet Application Development**

I will develop a simplified tablet application for HYSACAM truck drivers:

*Key Features:*
1. **Login Screen:** Driver enters employee ID and password
2. **Today's Route:** Shows list of bins assigned for collection today
3. **Navigation:** Tap any bin to get turn-by-turn GPS navigation using Google Maps
4. **Collection Confirmation:** Upon arrival, driver scans bin's QR code or manually confirms collection
5. **Photo Capture:** Take photo showing bin is now empty
6. **Offline Mode:** Works without internet, synchronizes when connection available

I will purchase 3 Android tablets (approximately 75,000 CFA each) and install the application.

### 4.3 Month 3 - Deployment and Testing

**Week 1: Physical Installation in Nlongkak**

Day 1-5: I will coordinate with HYSACAM to install 50 smart bins at the identified locations throughout Nlongkak. Each installation involves:
- Removing old bin (if present) or selecting new location
- Placing new smart bin
- Securing it to prevent theft (concrete base or chain lock)
- Verifying mobile signal strength at location
- Testing sensor operation
- Confirming data transmission to cloud
- Taking GPS coordinates
- Attaching QR code sticker and bin identification number
- Informing nearby residents about the new smart bin

**Week 2: User Training and Onboarding**

*HYSACAM Staff Training (2 days):*
- Day 1: Train managers on using web dashboard
  - How to view bin statuses
  - How to create and assign collection routes
  - How to review analytics
  - How to respond to citizen reports
- Day 2: Train drivers on using tablets
  - How to receive route assignments
  - How to navigate to bins
  - How to confirm collections
  - How to take and upload photos

*Community Training (2 days):*
- Day 3: Hold community meeting in Nlongkak explaining the system
- Day 4: Walk around neighborhood demonstrating the mobile app to interested residents
- Help people download and install the app
- Show them how to report problems

**Week 3: Pilot Operation**

The system goes live. I will closely monitor for one full week:
- Check that all 50 bins are transmitting data regularly
- Verify route optimization algorithm generates sensible routes
- Track that drivers successfully complete assigned collections
- Monitor citizen app usage and report submissions
- Document any technical problems or user difficulties

I will collect feedback from:
- HYSACAM managers about dashboard usability
- Drivers about tablet application
- Citizens about mobile app experience

**Week 4: Refinement and Documentation**

Based on Week 3 feedback, I will make necessary improvements:
- Fix any software bugs discovered
- Adjust sensor sensitivity if needed
- Improve user interface based on feedback
- Optimize route algorithm parameters

I will prepare comprehensive documentation:
- Technical architecture diagrams
- User manuals for each interface
- Maintenance procedures for hardware
- Data analysis showing improvements over traditional system
- Final project report for your course

---

## 5. Network Architecture Using WAN

Lecturer, let me now explain the complete network architecture of my system, demonstrating how WAN connects all components.

### 5.1 Network Topology

My system uses a **Star Topology** with the cloud server as the central hub:

**Central Hub (Cloud Server):**
- Location: AWS data center in Cape Town, South Africa (closest to Cameroon)
- Role: Receives data from all edge devices, processes information, stores data, sends instructions back
- Always online with 99.9% uptime guarantee from AWS

**Edge Devices (Spokes connecting to hub):**
1. **50 Smart Bins** scattered across Nlongkak
   - Each bin has unique identification
   - Connects to cloud via MTN/Orange cellular WAN
   - Sends data every 30 minutes or when 80% full
   
2. **Citizens' Mobile Devices** (estimated 500 initial users)
   - Smartphones running Android or iOS
   - Connect via WiFi or mobile data (3G/4G)
   - Send reports and receive notifications
   
3. **HYSACAM Collection Vehicles** (3 trucks in pilot)
   - Tablets with 4G mobile data
   - Continuous GPS tracking
   - Real-time route updates
   
4. **HYSACAM Office** (1 location)
   - Desktop computers
   - Fiber optic internet connection (if available) or ADSL
   - Management dashboard access



### 5.3 WAN Protocols and Technologies Used

**For Mobile Apps and Tablets:**
- **Physical Layer:** 4G LTE or 3G UMTS wireless, or WiFi 802.11 b/g/n
- **Data Link Layer:** LTE protocols or WiFi protocols
- **Network Layer:** IPv4/IPv6
- **Transport Layer:** TCP for critical data, UDP for real-time GPS updates
- **Application Layer:** HTTPS (secure web communication), WebSocket for real-time dashboard updates

**For HYSACAM Office:**
- **Physical Layer:** Fiber optic cable (if available) or copper DSL line
- **Data Link Layer:** Ethernet or PPP over DSL
- **Network Layer:** IPv4
- **Transport Layer:** TCP
- **Application Layer:** HTTPS for secure dashboard access

### 5.4 Network Security Architecture

Lecturer, security is critical because the system handles operational data and citizen information:

**Security Layer 1: Data Encryption in Transit**
- All communication between devices and cloud uses TLS 1.3 encryption
- Smart bins use HTTPS for API calls or encrypted SMS
- Mobile apps use certificate pinning to prevent man-in-the-middle attacks

**Security Layer 2: Authentication**
- Each smart bin has unique device ID and authentication token
- Citizens authenticate with phone number + SMS verification code
- HYSACAM staff use username/password + two-factor authentication
- All API requests require valid authentication tokens

**Security Layer 3: Cloud Infrastructure Security**
- AWS security groups act as firewall, only allowing necessary traffic
- Database accessible only from application server, not directly from internet
- Regular automated backups encrypted and stored in separate geographic region
- DDoS protection provided by AWS Shield

**Security Layer 4: Data Privacy**
- Citizen reports can be submitted anonymously
- Personal information (phone numbers, names) encrypted in database
- HYSACAM staff see only necessary operational data, not citizen personal details
- Regular security audits and penetration testing

### 5.5 Network Performance Optimization

To ensure system works well despite Cameroon's sometimes unreliable internet infrastructure:

**Bandwidth Optimization:**
- Smart bins send small data packets (typically under 1 KB per transmission)
- Photos from citizen reports compressed to maximum 200 KB before upload
- Dashboard uses data caching to minimize repeated downloads
- Map tiles cached on mobile devices for offline viewing

**Latency Mitigation:**
- Cloud server located in Cape Town (approximately 100ms latency from Yaoundé) rather than Europe (200ms+) or USA (300ms+)
- Mobile apps show immediate local feedback, sync to cloud in background
- Critical operations prioritized over non-urgent updates

**Reliability Through Redundancy:**
- Smart bins can failover between MTN and Orange networks
- Mobile apps queue operations when offline, sync when connection restored
- Cloud server has automatic failover to backup instance if primary fails
- Database backed up every hour to prevent data loss

**Cost Management:**
- Smart bins only transmit when necessary (not continuous streaming)
- Negotiated bulk data rates with mobile operators
- Scheduled large data transfers (like analytics reports) during off-peak hours when data is cheaper
