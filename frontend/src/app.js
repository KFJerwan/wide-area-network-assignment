// CloudWaste Yaoundé - Production Frontend
// App.js - Complete React Application with Real API Integration

import React, { useState, useEffect } from 'react';
import { MapPin, Trash2, AlertCircle, TrendingUp, Users, CheckCircle, Clock, Navigation, Camera, Send, Bell, Menu, X, BarChart3, Wifi, WifiOff, Download, Upload, Database, Server, RefreshCw } from 'lucide-react';

// API Configuration - Change this to your deployed API URL
const API_URL = process.env.REACT_APP_API_URL || 'https://cloudwaste-api.onrender.com';

const CloudWasteSystem = () => {
  const [view, setView] = useState('dashboard');
  const [userRole, setUserRole] = useState('manager');
  const [selectedBin, setSelectedBin] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cloudStatus, setCloudStatus] = useState('connecting');
  const [lastSync, setLastSync] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [bins, setBins] = useState([]);
  const [reports, setReports] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [stats, setStats] = useState({
    totalBins: 0,
    criticalBins: 0,
    activeTrucks: 0,
    pendingReports: 0,
    collectionsToday: 0,
    efficiency: 87
  });

  const [newReport, setNewReport] = useState({
    binId: '',
    issue: 'Overflowing bin',
    description: '',
    photo: null
  });

  // Fetch data from API on component mount
  useEffect(() => {
    fetchAllData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(() => {
      fetchAllData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchAllData = async () => {
    try {
      setCloudStatus('connecting');
      
      // Fetch bins
      const binsResponse = await fetch(`${API_URL}/api/bins`);
      if (!binsResponse.ok) throw new Error('Failed to fetch bins');
      const binsData = await binsResponse.json();
      setBins(binsData);
      
      // Fetch reports
      const reportsResponse = await fetch(`${API_URL}/api/reports`);
      if (!reportsResponse.ok) throw new Error('Failed to fetch reports');
      const reportsData = await reportsResponse.json();
      setReports(reportsData);
      
      // Fetch trucks
      const trucksResponse = await fetch(`${API_URL}/api/trucks`);
      if (!trucksResponse.ok) throw new Error('Failed to fetch trucks');
      const trucksData = await trucksResponse.json();
      setTrucks(trucksData);
      
      // Fetch stats
      const statsResponse = await fetch(`${API_URL}/api/stats`);
      if (!statsResponse.ok) throw new Error('Failed to fetch stats');
      const statsData = await statsResponse.json();
      setStats(statsData);
      
      setCloudStatus('connected');
      setLastSync(new Date());
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setCloudStatus('disconnected');
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSubmitReport = async () => {
    if (!newReport.binId || !newReport.description) {
      alert('Please select a bin and provide a description');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bin_id: newReport.binId,
          issue: newReport.issue,
          description: newReport.description,
          priority: 'medium'
        })
      });
      
      if (!response.ok) throw new Error('Failed to submit report');
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh reports
        await fetchAllData();
        
        setNewReport({ binId: '', issue: 'Overflowing bin', description: '', photo: null });
        setShowReport(false);
        alert('Report submitted successfully! HYSACAM will respond soon.');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Error submitting report. Please check your connection and try again.');
    }
  };

  const handleCollectBin = async (binId) => {
    try {
      const response = await fetch(`${API_URL}/api/collections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bin_id: binId,
          truck_id: trucks[0]?.id || 'TR001',
          driver_id: 2
        })
      });
      
      if (!response.ok) throw new Error('Failed to log collection');
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh all data
        await fetchAllData();
        alert(`Bin ${binId} collected successfully!`);
      }
    } catch (error) {
      console.error('Error logging collection:', error);
      alert('Error logging collection. Please try again.');
    }
  };

  const handleOptimizeRoute = async () => {
    try {
      const response = await fetch(`${API_URL}/api/optimize-route`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) throw new Error('Failed to optimize route');
      
      const data = await response.json();
      
      if (data.success) {
        alert(`Optimized route created with ${data.total_bins} bins. Assigning to next available truck...`);
        await fetchAllData();
      }
    } catch (error) {
      console.error('Error optimizing route:', error);
      alert('Error optimizing route. Please try again.');
    }
  };

  const getBinColor = (status) => {
    switch(status) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-green-600 bg-green-50';
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading CloudWaste System...</p>
          <p className="text-sm text-gray-500 mt-2">Connecting to cloud database</p>
        </div>
      </div>
    );
  }

  const DashboardView = () => (
    <div className="space-y-6">
      {/* Cloud Status Banner */}
      <div className={`rounded-lg p-4 flex items-center justify-between ${
        cloudStatus === 'connected' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
      }`}>
        <div className="flex items-center gap-3">
          {cloudStatus === 'connected' ? (
            <>
              <Wifi className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-semibold text-green-900">Cloud Connected</p>
                <p className="text-sm text-green-700">Last sync: {formatTime(lastSync)}</p>
              </div>
            </>
          ) : (
            <>
              <WifiOff className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-semibold text-red-900">Connection Lost</p>
                <p className="text-sm text-red-700">Attempting to reconnect...</p>
              </div>
            </>
          )}
        </div>
        <button
          onClick={fetchAllData}
          className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Bins</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBins}</p>
            </div>
            <Trash2 className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Critical</p>
              <p className="text-2xl font-bold text-red-600">{stats.criticalBins}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Trucks</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeTrucks}</p>
            </div>
            <Navigation className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today</p>
              <p className="text-2xl font-bold text-gray-900">{stats.collectionsToday}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Reports</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingReports}</p>
            </div>
            <Users className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Efficiency</p>
              <p className="text-2xl font-bold text-green-600">{stats.efficiency}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Critical Bins Alert */}
      {stats.criticalBins > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900">Urgent Action Required</h3>
                <p className="text-sm text-red-700 mt-1">
                  {stats.criticalBins} bins are at critical capacity and need immediate collection.
                </p>
              </div>
            </div>
            <button
              onClick={handleOptimizeRoute}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium whitespace-nowrap"
            >
              Auto-Assign Route
            </button>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Live Bins Map */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Live Bins Status</h2>
          </div>
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {bins.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Trash2 className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No bins found. Check your database connection.</p>
              </div>
            ) : (
              bins.map(bin => (
                <div key={bin.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`p-2 rounded-lg ${getBinColor(bin.status)}`}>
                        <Trash2 className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{bin.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(bin.status)}`}>
                            {bin.fill_level}%
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {bin.neighborhood}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(bin.last_collection)}
                          </span>
                          <span>🔋 {bin.battery}%</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedBin(bin)}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Details
                    </button>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        bin.fill_level >= 80 ? 'bg-red-600' : 
                        bin.fill_level >= 60 ? 'bg-yellow-600' : 
                        'bg-green-600'
                      }`}
                      style={{ width: `${bin.fill_level}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Active Trucks & Reports */}
        <div className="space-y-6">
          {/* Trucks */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Active Trucks</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {trucks.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Navigation className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>No trucks found</p>
                </div>
              ) : (
                trucks.map(truck => (
                  <div key={truck.id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{truck.id} - {truck.driver_name}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {truck.location}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        truck.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {truck.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>⛽ {truck.fuel_level}%</span>
                      <span>📍 GPS {truck.gps_active ? 'Active' : 'Inactive'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Reports */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Citizen Reports</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {reports.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>No reports yet</p>
                </div>
              ) : (
                reports.slice(0, 5).map(report => (
                  <div key={report.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{report.issue}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            report.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {report.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{report.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {report.neighborhood} • {formatDate(report.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const CitizenView = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome to CloudWaste Yaoundé</h2>
        <p className="text-green-50">Help keep your neighborhood clean by reporting waste issues</p>
        <div className="mt-4 flex items-center gap-2 text-sm">
          <Wifi className="w-4 h-4" />
          <span>{cloudStatus === 'connected' ? 'Connected' : 'Connecting...'}</span>
        </div>
      </div>

      <button
        onClick={() => setShowReport(true)}
        className="w-full bg-blue-600 text-white rounded-lg p-4 flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors font-semibold shadow-lg"
      >
        <Camera className="w-5 h-5" />
        Report a Waste Problem
      </button>

      {/* Nearby Bins */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Bins Near You</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {bins.slice(0, 5).map(bin => (
            <div key={bin.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`p-3 rounded-lg ${getBinColor(bin.status)}`}>
                    <Trash2 className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{bin.name}</h3>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {bin.neighborhood}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(bin.last_collection)}
                      </span>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-2 rounded-full text-sm font-bold ${getStatusBadge(bin.status)}`}>
                  {bin.fill_level}%
                </span>
              </div>
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      bin.fill_level >= 80 ? 'bg-red-600' : 
                      bin.fill_level >= 60 ? 'bg-yellow-600' : 
                      'bg-green-600'
                    }`}
                    style={{ width: `${bin.fill_level}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My Reports */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Reports</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {reports.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No reports yet. Be the first to report!</p>
            </div>
          ) : (
            reports.slice(0, 5).map(report => (
              <div key={report.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{report.issue}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        report.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                    <p className="text-xs text-gray-500">{formatDate(report.created_at)}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const DriverView = () => {
    const myTruck = trucks[0] || { id: 'No truck assigned', driver_name: 'Driver', status: 'idle', fuel_level: 0 };
    const criticalBins = bins.filter(b => b.status === 'critical' || b.status === 'warning');
    
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Today's Route</h2>
          <p className="text-blue-50 mb-4">Truck: {myTruck.id} | Driver: {myTruck.driver_name}</p>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Wifi className="w-4 h-4" />
              <span>{cloudStatus === 'connected' ? 'GPS Active' : 'Offline'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Database className="w-4 h-4" />
              <span>Synced {formatTime(lastSync)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Fuel Level</p>
            <p className="text-3xl font-bold text-gray-900">{myTruck.fuel_level}%</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Status</p>
            <p className="text-3xl font-bold text-green-600 capitalize">{myTruck.status}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Priority Collections ({criticalBins.length})</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {criticalBins.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-600" />
                <p className="font-semibold">All bins are under control!</p>
                <p className="text-sm mt-1">No urgent collections needed</p>
              </div>
            ) : (
              criticalBins.map((bin, index) => (
                <div key={bin.id} className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">{bin.name}</h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {bin.neighborhood}
                        </span>
                        <span>📍 {bin.lat?.toFixed(4)}, {bin.lng?.toFixed(4)}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-2 rounded-full text-sm font-bold ${getStatusBadge(bin.status)}`}>
                      {bin.fill_level}%
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full ${
                          bin.fill_level >= 80 ? 'bg-red-600' : 
                          bin.fill_level >= 60 ? 'bg-yellow-600' : 
                          'bg-green-600'
                        }`}
                        style={{ width: `${bin.fill_level}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button className="bg-blue-600 text-white rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors font-semibold">
                      <Navigation className="w-5 h-5" />
                      Navigate
                    </button>
                    <button
                      onClick={() => handleCollectBin(bin.id)}
                      className="bg-green-600 text-white rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-green-700 transition-colors font-semibold"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Collected
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-green-600 to-blue-600 p-2.5 rounded-lg shadow-lg">
                <Trash2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CloudWaste Yaoundé</h1>
                <p className="text-sm text-gray-600">Smart Waste Management System</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Server className="w-4 h-4" />
                <span>Cloud</span>
              </div>
              <div className={`flex items-center gap-2 ${cloudStatus === 'connected' ? 'text-green-600' : 'text-red-600'}`}>
                {cloudStatus === 'connected' ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                <span>{cloudStatus === 'connected' ? 'Connected' : 'Offline'}</span>
              </div>
            </div>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <p className="text-sm text-gray-600 mb-3 font-medium">Select User Role:</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setUserRole('manager')}
              className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                userRole === 'manager'
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📊 Manager
            </button>
            <button
              onClick={() => setUserRole('driver')}
              className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                userRole === 'driver'
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🚚 Driver
            </button>
            <button
              onClick={() => setUserRole('citizen')}
              className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                userRole === 'citizen'
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              👤 Citizen
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900">Connection Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
                <button
                  onClick={fetchAllData}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  Retry Connection
                </button>
              </div>
            </div>
          </div>
        )}

        {userRole === 'manager' && <DashboardView />}
        {userRole === 'driver' && <DriverView />}
        {userRole === 'citizen' && <CitizenView />}
      </div>

      {showReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Report Problem</h2>
              <button
                onClick={() => setShowReport(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Bin *
                </label>
                <select
                  value={newReport.binId}
                  onChange={(e) => setNewReport({...newReport, binId: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose a bin...</option>
                  {bins.map(bin => (
                    <option key={bin.id} value={bin.id}>
                      {bin.name} ({bin.neighborhood})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issue Type *
                </label>
                <select
                  value={newReport.issue}
                  onChange={(e) => setNewReport({...newReport, issue: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option>Overflowing bin</option>
                  <option>Missed collection</option>
                  <option>Broken bin</option>
                  <option>Illegal dumping</option>
                  <option>Bad odor</option>
                  <option>Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={newReport.description}
                  onChange={(e) => setNewReport({...newReport, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="4"
                  placeholder="Describe the problem in detail..."
                />
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Click to take photo</p>
                <p className="text-xs text-gray-500 mt-1">(Optional - Coming soon)</p>
              </div>
              
              <button
                onClick={handleSubmitReport}
                disabled={!newReport.binId || !newReport.description}
                className="w-full bg-blue-600 text-white rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg"
              >
                <Send className="w-5 h-5" />
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedBin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Bin Details</h2>
              <button
                onClick={() => setSelectedBin(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className={`p-6 rounded-lg ${getBinColor(selectedBin.status)}`}>
                <div className="flex items-center justify-between">
                  <Trash2 className="w-10 h-10" />
                  <div className="text-right">
                    <div className="text-4xl font-bold">{selectedBin.fill_level}%</div>
                    <div className="text-sm uppercase font-semibold mt-1">{selectedBin.status}</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Bin ID</p>
                  <p className="font-semibold text-gray-900">{selectedBin.id}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Location</p>
                  <p className="font-semibold text-gray-900">{selectedBin.name}</p>
                  <p className="text-sm text-gray-600">{selectedBin.neighborhood}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Last Collection</p>
                    <p className="font-semibold text-gray-900 text-sm">{formatDate(selectedBin.last_collection)}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Battery</p>
                    <p className="font-semibold text-gray-900">{selectedBin.battery}%</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Temperature</p>
                    <p className="font-semibold text-gray-900">{selectedBin.temperature || 'N/A'}°C</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Last Update</p>
                    <p className="font-semibold text-gray-900 text-sm">
                      {formatTime(selectedBin.last_update)}
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">GPS Coordinates</p>
                  <p className="font-mono text-sm text-gray-900">
                    {selectedBin.lat?.toFixed(6)}, {selectedBin.lng?.toFixed(6)}
                  </p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-700 font-semibold mb-2">Hardware Info</p>
                  <div className="space-y-1 text-sm">
                    <p className="text-blue-900"><span className="font-semibold">Sensor:</span> {selectedBin.hardware_sensor || 'N/A'}</p>
                    <p className="text-blue-900"><span className="font-semibold">Controller:</span> {selectedBin.hardware_controller || 'N/A'}</p>
                    <p className="text-blue-900"><span className="font-semibold">Network:</span> {selectedBin.hardware_network || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CloudWasteSystem;