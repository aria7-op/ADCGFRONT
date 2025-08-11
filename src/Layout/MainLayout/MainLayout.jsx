import React, { useState, useEffect, useRef } from 'react';
import { useLogout } from '../../hooks/useAuth';
import Sidebar from '../../components/Sidebar/Sidebar';
import Dashboard from '../../features/Dashboard/Dashboard';
import Task from '../../features/Task/Task';
import Projects from '../../features/Projects/Projects';
import FavoriteProjects from '../../features/Projects/FavoriteProjects';
import Calendar from '../../features/Projects/Calendar';
import Gantt from '../../features/Projects/Gantt';
import BulkUpload from '../../features/Projects/BulkUpload';
import ActivityLogs from '../../features/ActivityLogs/ActivityLogs';
import CalendarMenu from '../../features/Calendar/Calendar';
import Chat from '../../features/Chat/Chat';
import Clients from '../../features/Clients/Clients';
import Contracts from '../../features/Contracts/Contracts';
import KnowledgeBase from '../../features/KnowledgeBase/KnowledgeBase';
import Leads from '../../features/Leads/Leads';
import LeaveRequests from '../../features/LeaveRequests/LeaveRequests';
import Meetings from '../../features/Meetings/Meetings';
import Notes from '../../features/Notes/Notes';
import Payslip from '../../features/Payslip/Payslip';
import Statuses from '../../features/Statuses/Statuses';
import SystemRegistration from '../../features/SystemRegistration/SystemRegistration';
import TimeTracker from '../../features/TimeTracker/TimeTracker';
import Users from '../../features/Users/Users';
import Expenses from '../../features/Finance/Expenses';
import Estimates from '../../features/Finance/Estimates';
import Invoices from '../../features/Finance/Invoices';
import Items from '../../features/Finance/Items';
import Payments from '../../features/Finance/Payments';
import TasksReport from '../../features/Reports/TasksReport';
import ProjectsReport from '../../features/Reports/ProjectsReport';
import LeadsReport from '../../features/Reports/LeadsReport';
import InvoicesReport from '../../features/Reports/InvoicesReport';
import Settings from '../../features/Settings/Settings';
import Notifications from '../../features/Notifications/Notifications';
import SendMail from '../../features/Mail/SendMail';
import Announcements from '../../features/Announcements/Announcements';
import Profile from '../../features/Profile/Profile';
import NetworkTest from '../../components/NetworkTest';

function MainLayout({ children }) {
  const logoutMutation = useLogout();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true); // Start collapsed by default for all devices
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);

  
  // Responsive sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768; // 768px is the breakpoint for md in Tailwind
      const isTablet = /iPad|Android/.test(navigator.userAgent) && window.innerWidth >= 768 && window.innerWidth <= 1024;
      
      // Only treat as mobile if it's actually a small screen
      // Tablets/iPads should behave like desktop for sidebar behavior
      setIsMobile(mobile);
      
      // On mobile, always keep sidebar collapsed (hidden)
      // On desktop and tablets, allow sidebar to be expanded/collapsed
      if (mobile) {
        setSidebarCollapsed(true);
      } else {
        // Don't auto-expand on tablets, let user control it
        // setSidebarCollapsed(false);
      }
    };

    // Set initial state based on screen size
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup event listener
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Ensure sidebar is hidden on mobile on initial load
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  }, [isMobile]);
  
  // Timer state
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [selectedProjectForTimer, setSelectedProjectForTimer] = useState('');
  const [timerMessage, setTimerMessage] = useState('');
  const intervalRef = useRef(null);

  // Mock projects data
  const projects = [
    'Customer Satisfaction Improvement Initiative',
    'Product Packaging Redesign',
    'New Product Development',
    'Employee Recognition Program',
    'Supply Chain Optimization'
  ];

  // Timer functions
  const startTimer = () => {
    if (!selectedProjectForTimer) {
      alert('Please select a project first');
      return;
    }
    setIsRunning(true);
    setIsPaused(false);
  };

  const stopTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTime({ hours: 0, minutes: 0, seconds: 0 });
    setTimerMessage('');
    setSelectedProjectForTimer('');
    setShowTimerModal(false);
  };

  const pauseTimer = () => {
    setIsPaused(!isPaused);
  };

  // Timer effect
  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => {
          let { hours, minutes, seconds } = prevTime;
          seconds++;
          if (seconds >= 60) {
            seconds = 0;
            minutes++;
            if (minutes >= 60) {
              minutes = 0;
              hours++;
            }
          }
          return { hours, minutes, seconds };
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, isPaused]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownOpen && !event.target.closest('.user-dropdown')) {
        setUserDropdownOpen(false);
      }
      if (showNotificationsDropdown && !event.target.closest('.notifications-dropdown')) {
        setShowNotificationsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userDropdownOpen, showNotificationsDropdown]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
          return <Dashboard />;
      case 'statuses':
          return <Statuses />;
      case 'projects-all':
          return <Projects />;
      case 'projects-favorite':
          return <FavoriteProjects />;
      case 'projects-calendar':
          return <Calendar />;
      case 'projects-gantt':
          return <Gantt />;
      case 'projects-bulk':
          return <BulkUpload />;
      case 'tasks':
          return <Task />;
      case 'leads':
          return <Leads />;
      case 'payslip':
          return <Payslip />
      case 'meetings':
          return <Meetings />;
      case 'calendar':
          return <CalendarMenu />;
      case 'chat':
          return <Chat />;
      case 'finance-expenses':
          return <Expenses />;
      case 'finance-estimates':
          return <Estimates />;
      case 'finance-invoices':
          return <Invoices />;
      case 'finance-items':
          return <Items />;
      case 'finance-payments':
          return <Payments />;
      case 'users':
          return <Users />;
      case 'clients':
          return <Clients />;
      case 'knowledgebase':
          return <KnowledgeBase />;
      case 'contracts':
          return <Contracts />;
      case 'activitylogs':
          return <ActivityLogs />;
      case 'leaverequest':
          return <LeaveRequests />;
      case 'notes':
          return <Notes />;
      case 'reports-projects':
          return <ProjectsReport />;
      case 'reports-tasks':
          return <TasksReport />;
      case 'reports-leads':
          return <LeadsReport />;
      case 'reports-invoices':
          return <InvoicesReport />;
      case 'systemregistrations':
          return <SystemRegistration />;
      case 'timetracker':
          return <TimeTracker />;
             case 'settings':
           return <Settings />;
       case 'notifications':
           return <Notifications />;
       case 'sendmail':
           return <SendMail />;
       case 'announcements':
           return <Announcements />;
       case 'profile':
           return <Profile />;
       case 'networktest':
           return <NetworkTest />;
       default:
         return children;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Main Wrapper */}
      <div className="main-wrapper">
                 {/* Top Navigation Bar */}
                                       <nav className={`absolute top-0 ${isMobile ? 'left-0' : (sidebarCollapsed ? 'left-16' : 'left-64')} right-0 h-16 flex items-center justify-between px-2 sm:px-4 z-50 bg-gradient-to-l from-[#0c415c] to-[#ff7a22] rounded-lg transition-all duration-300`}>
            {/* Left side - Menu and title */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button 
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="text-white p-2 sm:p-3 hover:bg-white/10 rounded"
              >
                <i className="fas fa-bars text-base sm:text-lg"></i>
              </button>
              <span className="text-white text-base sm:text-lg font-semibold hidden sm:block">ADCG</span>
              <span className="text-white text-sm font-semibold sm:hidden">ADCG</span>
            </div>

            {/* Center - Search (hidden on very small screens) */}
            <div className="hidden sm:flex flex-1 max-w-md mx-4 lg:mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-8 pr-4 py-1.5 sm:py-2 bg-white/20 text-white placeholder-white/70 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
                />
                <i className="fas fa-search absolute left-2.5 top-1/2 transform -translate-y-1/2 text-white/70 text-sm"></i>
              </div>
            </div>

            {/* Right side - User menu */}
            <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
              {/* Mail Icon */}
              <div className="relative tooltip-container">
                <button 
                  onClick={() => setActiveTab('sendmail')}
                  className="text-white p-1.5 sm:p-2 hover:bg-white/10 rounded"
                >
                  <i className="fas fa-envelope text-base sm:text-lg"></i>
                </button>
                {/* Mail Tooltip */}
                <div className="tooltip tooltip-bottom">
                  Mail
                  <div className="tooltip-arrow tooltip-arrow-bottom"></div>
                </div>
              </div>
              
              {/* Megaphone Icon */}
              <div className="relative tooltip-container">
                <button 
                  onClick={() => setActiveTab('announcements')}
                  className="text-white p-1.5 sm:p-2 hover:bg-white/10 rounded"
                >
                  <i className="fas fa-bullhorn text-base sm:text-lg"></i>
                </button>
                {/* Megaphone Tooltip */}
                <div className="tooltip tooltip-bottom">
                  Announcements
                  <div className="tooltip-arrow tooltip-arrow-bottom"></div>
                </div>
              </div>
              
              {/* Notifications */}
              <div className="relative tooltip-container notifications-dropdown">
                <button 
                  onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
                  className="text-white p-1.5 sm:p-2 hover:bg-white/10 rounded relative"
                >
                  <i className="far fa-bell text-base sm:text-lg"></i>
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                    <i className="fas fa-bell text-xs"></i>
                  </span>
                </button>
                {/* Notifications Tooltip */}
                <div className="tooltip tooltip-bottom">
                  Notifications
                  <div className="tooltip-arrow tooltip-arrow-bottom"></div>
                </div>
                
                {/* Notifications Dropdown */}
                {showNotificationsDropdown && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Mark all as read
                      </button>
                    </div>
                    
                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                      {/* Notification Item */}
                      <div className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                              <i className="fas fa-bell text-white text-sm"></i>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900">
                              John Smith created event Fgh.
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              12-JUL-2025 08:33:47
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* More notification items can be added here */}
                      <div className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                              <i className="fas fa-user text-white text-sm"></i>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900">
                              New user registration completed.
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              12-JUL-2025 07:15:30
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                              <i className="fas fa-check text-white text-sm"></i>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900">
                              Project status updated to completed.
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              12-JUL-2025 06:45:22
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                                         {/* Footer */}
                     <div className="p-4 border-t border-gray-200 text-center">
                       <button 
                         onClick={() => {
                           setShowNotificationsDropdown(false);
                           setActiveTab('notifications');
                         }}
                         className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                       >
                         View All &gt;
                       </button>
                     </div>
                  </div>
                )}
              </div>

                             {/* User dropdown */}
               <div className={`relative user-dropdown tooltip-container ${userDropdownOpen ? 'tooltip-hidden' : ''}`}>
                 <button 
                   onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                   className="flex items-center space-x-1 sm:space-x-2 text-white hover:bg-white/10 rounded p-1.5 sm:p-2"
                 >
                   <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
                     MA
                   </div>
                   <span className="hidden lg:block">Hi 👋, Main</span>
                   <i className={`fas fa-chevron-down text-xs sm:text-sm transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`}></i>
                 </button>
                 {/* User Tooltip */}
                 <div className="tooltip tooltip-bottom">
                   User Menu
                   <div className="tooltip-arrow tooltip-arrow-bottom"></div>
                 </div>
                
                                 {/* User Dropdown Menu */}
                 {userDropdownOpen && (
                   <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                     <div className="py-1">
                       <button 
                         onClick={() => {
                           setUserDropdownOpen(false);
                           setActiveTab('profile');
                         }}
                         className="w-full flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                       >
                         <i className="fas fa-user text-gray-500"></i>
                         <span>Profile</span>
                       </button>
                       <button 
                         onClick={async () => {
                           try {
                             await logoutMutation.mutateAsync();
                             // React Query will handle the redirect
                           } catch (error) {
                             console.error('Logout failed:', error);
                           }
                         }}
                         disabled={logoutMutation.isPending}
                         className="w-full flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 text-left text-red-600 hover:bg-gray-50 transition-colors text-sm disabled:opacity-50"
                       >
                         <i className="fas fa-sign-out-alt text-red-500"></i>
                         <span>{logoutMutation.isPending ? 'Logging out...' : 'Logout'}</span>
                       </button>
                     </div>
                   </div>
                 )}
              </div>
            </div>
        </nav>

                 

                                   {/* Sidebar Component */}
          <Sidebar onTabChange={handleTabChange} activeTab={activeTab} collapsed={sidebarCollapsed} isMobile={isMobile} />

                   {/* Main Content Area */}
                     <main className={`${isMobile ? 'ml-0' : (sidebarCollapsed ? 'ml-16' : 'ml-64')} mr-0 px-2 sm:p-4 lg:p-6 pt-20 sm:pt-22 lg:pt-24 transition-all duration-300`}>
          {renderContent()}
        </main>
      </div>

             {/* Floating Action Buttons */}
               <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 flex flex-col space-y-2 sm:space-y-3 z-50">
          {/* Chat Button */}
          <div className="relative tooltip-container">
            <button className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors">
              <i className="fas fa-comment text-base sm:text-lg"></i>
            </button>
           {/* Chat Tooltip */}
           <div className="tooltip">
             Chat
             {/* Tooltip arrow */}
             <div className="tooltip-arrow"></div>
           </div>
         </div>
         
                   {/* Timer Button */}
          <div className="relative tooltip-container">
            <button 
              onClick={() => setShowTimerModal(true)}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-orange-600 transition-colors"
            >
              <i className="fas fa-stopwatch text-base sm:text-lg"></i>
            </button>
           {/* Timer Tooltip */}
           <div className="tooltip">
             Timer
             {/* Tooltip arrow */}
             <div className="tooltip-arrow"></div>
           </div>
         </div>
       </div>

                    {/* Timer Modal */}
       {showTimerModal && (
         <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50">
           <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Timer</h3>
              <button
                onClick={() => setShowTimerModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="space-y-4">
              {/* Project Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                <select
                  value={selectedProjectForTimer}
                  onChange={(e) => setSelectedProjectForTimer(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Project</option>
                  {projects.map(project => (
                    <option key={project} value={project}>{project}</option>
                  ))}
                </select>
              </div>

              {/* Timer Display */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <input
                    type="text"
                    value={time.hours.toString().padStart(2, '0')}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-center text-lg font-mono"
                  />
                  <div className="text-center text-sm text-gray-600 mt-1">Hours</div>
                </div>
                <div>
                  <input
                    type="text"
                    value={time.minutes.toString().padStart(2, '0')}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-center text-lg font-mono"
                  />
                  <div className="text-center text-sm text-gray-600 mt-1">Minutes</div>
                </div>
                <div>
                  <input
                    type="text"
                    value={time.seconds.toString().padStart(2, '0')}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-center text-lg font-mono"
                  />
                  <div className="text-center text-sm text-gray-600 mt-1">Seconds</div>
                </div>
              </div>

              {/* Timer Controls */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={startTimer}
                  disabled={isRunning}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  <i className="fas fa-play"></i>
                </button>
                <button
                  onClick={stopTimer}
                  disabled={!isRunning}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  <i className="fas fa-stop"></i>
                </button>
                <button
                  onClick={pauseTimer}
                  disabled={!isRunning}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50"
                >
                  <i className="fas fa-pause"></i>
                </button>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  value={timerMessage}
                  onChange={(e) => setTimerMessage(e.target.value)}
                  placeholder="Enter your message"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                />
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <a
                href="#"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <i className="fas fa-clock"></i>
                View all Timesheets
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Font Awesome CDN */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
      />
    </div>
  );
}

export default MainLayout;
