import React, { useState } from 'react';

function Sidebar({ onTabChange, activeTab, collapsed = false, isMobile = false }) {
  const [projectsDropdownOpen, setProjectsDropdownOpen] = useState(false);
  const [financeDropdownOpen, setFinanceDropdownOpen] = useState(false);
  const [reportsDropdownOpen, setReportsDropdownOpen] = useState(false);
  
  const handleTabClick = (tabName) => {
    onTabChange(tabName);
  };

  const handleProjectsClick = () => {
    setProjectsDropdownOpen(!projectsDropdownOpen);
  };

  const handleProjectSubItemClick = (subItem) => {
    onTabChange(`projects-${subItem}`);
    setProjectsDropdownOpen(false);
  };

  const handleFinanceClick = () => {
    setFinanceDropdownOpen(!financeDropdownOpen);
  };

  const handleFinanceSubItemClick = (subItem) => {
    onTabChange(`finance-${subItem}`);
    setFinanceDropdownOpen(false);
  };

  const handleReportsClick = () => {
    setReportsDropdownOpen(!reportsDropdownOpen);
  };

  const handleReportsSubItemClick = (subItem) => {
    onTabChange(`reports-${subItem}`);
    setReportsDropdownOpen(false);
  };

  // Helper function to render navigation items
  const renderNavItem = (icon, text, onClick, isActive = false, hasDropdown = false, dropdownOpen = false) => {
    if (collapsed && !isMobile) {
      return (
        <button 
          onClick={onClick}
          className={`w-full flex items-center justify-center p-3 text-left rounded-lg transition-colors ${
            isActive 
              ? 'bg-white/10 text-white' 
              : 'text-white hover:bg-white/10 hover:text-white'
          }`}
          title={text}
        >
          {icon}
        </button>
      );
    }

    return (
      <button 
        onClick={onClick}
        className={`w-full flex items-center ${hasDropdown ? 'justify-between' : 'space-x-3'} p-2 text-left rounded-lg transition-colors ${
          isActive 
            ? 'bg-white/10 text-white' 
            : 'text-white hover:bg-white/10 hover:text-white'
        }`}
      >
        <div className="flex items-center space-x-3">
          {icon}
          <span>{text}</span>
        </div>
        {hasDropdown && (
          <i className={`fas fa-chevron-down text-sm text-white transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}></i>
        )}
      </button>
    );
  };

  return (
    <aside className={`fixed top-0 left-0 ${isMobile ? 'w-64' : (collapsed ? 'w-16' : 'w-64')} h-full bg-primary text-white shadow-lg z-40 overflow-y-auto transition-all duration-300 ${
      isMobile ? 'scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400' :
      (collapsed 
        ? 'scrollbar-none' 
        : 'scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400')
    } ${isMobile && collapsed ? '-translate-x-full' : ''}`} style={{
      scrollbarWidth: isMobile ? 'thin' : (collapsed ? 'none' : 'thin'),
      msOverflowStyle: isMobile ? 'auto' : (collapsed ? 'none' : 'auto'),
      transform: isMobile && collapsed ? 'translateX(-100%)' : 'translateX(0)'
    }}>
      {/* Logo */}
      <div className="p-4">
        <div className="flex items-center space-x-3">
          <img src="/favicon.png" alt="Task Hub" className="h-10" />
          {(!collapsed || isMobile) && (
            <span className="text-2xl font-bold text-white">
              ADCG
            </span>
          )}
        </div>
      </div>

      {/* Workspace Selector */}
      {(!collapsed || isMobile) && (
        <div className="p-4 border-b-2 border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <i className="fas fa-check text-white"></i>
              <span className="font-semibold text-white">Workspace 1</span>
            </div>
            <button className="text-white hover:text-white/80">
              <i className="fas fa-chevron-down"></i>
            </button>
          </div>
        </div>
      )}

      {/* Search Input */}
      {(!collapsed || isMobile) && (
        <div className="p-4 pb-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="p-4 pt-2">
        <ul className="space-y-1">
          <li>
            {renderNavItem(
              <i className="fas fa-tachometer-alt text-white"></i>,
              'Dashboard',
              () => handleTabClick('dashboard'),
              activeTab === 'dashboard'
            )}
          </li>
          <li>
            {renderNavItem(
              <i className="fas fa-file-contract text-white"></i>,
              'Statuses',
              () => handleTabClick('statuses'),
              activeTab === 'statuses'
            )}
          </li>
          <li>
            {renderNavItem(
              <i className="fas fa-project-diagram text-white"></i>,
              'Projects',
              handleProjectsClick,
              activeTab.startsWith('projects'),
              true,
              projectsDropdownOpen
            )}
            
                         {/* Projects Dropdown */}
             {projectsDropdownOpen && (!collapsed || isMobile) && (
               <ul className="ml-8 mt-1 space-y-1">
                 <li>
                   <button 
                     onClick={() => handleProjectSubItemClick('all')}
                     className={`w-full flex items-center space-x-3 p-2 text-left rounded-lg transition-colors text-sm ${
                       activeTab === 'projects-all' 
                         ? 'bg-white/10 text-white' 
                         : 'text-white hover:bg-white/10 hover:text-white'
                     }`}
                   >
                     <i className="fas fa-project-diagram text-white"></i>
                     <span>Projects</span>
                   </button>
                 </li>
                 <li>
                   <button 
                     onClick={() => handleProjectSubItemClick('favorite')}
                     className={`w-full flex items-center space-x-3 p-2 text-left rounded-lg transition-colors text-sm ${
                       activeTab === 'projects-favorite' 
                         ? 'bg-white/10 text-white' 
                         : 'text-white hover:bg-white/10 hover:text-white'
                     }`}
                   >
                     <i className="fas fa-heart text-white"></i>
                     <span>Favorite Projects</span>
                   </button>
                 </li>
                 <li>
                   <button 
                     onClick={() => handleProjectSubItemClick('calendar')}
                     className={`w-full flex items-center space-x-3 p-2 text-left rounded-lg transition-colors text-sm ${
                       activeTab === 'projects-calendar' 
                         ? 'bg-white/10 text-white' 
                         : 'text-white hover:bg-white/10 hover:text-white'
                     }`}
                   >
                     <i className="fas fa-calendar-alt text-white"></i>
                     <span>Calendar View</span>
                   </button>
                 </li>
                 <li>
                   <button 
                     onClick={() => handleProjectSubItemClick('gantt')}
                     className={`w-full flex items-center space-x-3 p-2 text-left rounded-lg transition-colors text-sm ${
                       activeTab === 'projects-gantt' 
                         ? 'bg-white/10 text-white' 
                         : 'text-white hover:bg-white/10 hover:text-white'
                     }`}
                   >
                     <i className="fas fa-chart-bar text-white"></i>
                     <span>Gantt Chart</span>
                   </button>
                 </li>
                 <li>
                   <button 
                     onClick={() => handleProjectSubItemClick('bulk')}
                     className={`w-full flex items-center space-x-3 p-2 text-left rounded-lg transition-colors text-sm ${
                       activeTab === 'projects-bulk' 
                         ? 'bg-white/10 text-white' 
                         : 'text-white hover:bg-white/10 hover:text-white'
                     }`}
                   >
                     <i className="fas fa-upload text-white"></i>
                     <span>Bulk Upload</span>
                   </button>
                 </li>
               </ul>
             )}
          </li>
          <li>
            {renderNavItem(
              <i className="fas fa-tasks text-white"></i>,
              'Tasks',
              () => handleTabClick('tasks'),
              activeTab === 'tasks'
            )}
          </li>
          <li>
            {renderNavItem(
              <i className="fas fa-tty text-white"></i>,
              'Leads',
              () => handleTabClick('leads'),
              activeTab === 'leads'
            )}
          </li>
          <li>
            {renderNavItem(
              <i className="fas fa-receipt text-white"></i>,
              'Payslip',
              () => handleTabClick('payslip'),
              activeTab === 'payslip'
            )}
          </li>
          <li>
            {renderNavItem(
              <i className="fas fa-calendar text-white"></i>,
              'Meetings',
              () => handleTabClick('meetings'),
              activeTab === 'meetings'
            )}
          </li>
          <li>
            {renderNavItem(
              <i className="fas fa-calendar-alt text-white"></i>,
              'Calendar',
              () => handleTabClick('calendar'),
              activeTab === 'calendar'
            )}
          </li>
          <li>
            {renderNavItem(
              <i className="fas fa-comments text-white"></i>,
              'Chat',
              () => handleTabClick('chat'),
              activeTab === 'chat'
            )}
          </li>
          <li>
            {renderNavItem(
              <i className="fas fa-dollar-sign text-white"></i>,
              'Finance',
              handleFinanceClick,
              activeTab.startsWith('finance'),
              true,
              financeDropdownOpen
            )}
            
            {/* Finance Dropdown */}
            {financeDropdownOpen && (!collapsed || isMobile) && (
              <ul className="ml-8 mt-1 space-y-1">
                <li>
                  <button 
                    onClick={() => handleFinanceSubItemClick('expenses')}
                    className={`w-full flex items-center space-x-3 p-2 text-left rounded-lg transition-colors text-sm ${
                      activeTab === 'finance-expenses' 
                        ? 'bg-white/10 text-white' 
                        : 'text-white hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <i className="fas fa-receipt text-white"></i>
                    <span>Expenses</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleFinanceSubItemClick('estimates')}
                    className={`w-full flex items-center space-x-3 p-2 text-left rounded-lg transition-colors text-sm ${
                      activeTab === 'finance-estimates' 
                        ? 'bg-white/10 text-white' 
                        : 'text-white hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <i className="fas fa-calculator text-white"></i>
                    <span>Estimates</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleFinanceSubItemClick('invoices')}
                    className={`w-full flex items-center space-x-3 p-2 text-left rounded-lg transition-colors text-sm ${
                      activeTab === 'finance-invoices' 
                        ? 'bg-white/10 text-white' 
                        : 'text-white hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <i className="fas fa-file-invoice text-white"></i>
                    <span>Invoices</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleFinanceSubItemClick('items')}
                    className={`w-full flex items-center space-x-3 p-2 text-left rounded-lg transition-colors text-sm ${
                      activeTab === 'finance-items' 
                        ? 'bg-white/10 text-white' 
                        : 'text-white hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <i className="fas fa-box text-white"></i>
                    <span>Items</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleFinanceSubItemClick('payments')}
                    className={`w-full flex items-center space-x-3 p-2 text-left rounded-lg transition-colors text-sm ${
                      activeTab === 'finance-payments' 
                        ? 'bg-white/10 text-white' 
                        : 'text-white hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <i className="fas fa-credit-card text-white"></i>
                    <span>Payments</span>
                  </button>
                </li>
              </ul>
            )}
          </li>
          <li>
            {renderNavItem(
              <i className="fas fa-user text-white"></i>,
              'Users',
              () => handleTabClick('users'),
              activeTab === 'users'
            )}
          </li>
          <li>
            {renderNavItem(
              <i className="fas fa-users text-white"></i>,
              'Clients',
              () => handleTabClick('clients'),
              activeTab === 'clients'
            )}
          </li>
          <li>
            {renderNavItem(
              <i className="fas fa-book text-white"></i>,
              'Knowledge Base',
              () => handleTabClick('knowledgebase'),
              activeTab === 'knowledgebase'
            )}
          </li>
          <li>
            {renderNavItem(
              <i className="fas fa-file-contract text-white"></i>,
              'Contracts',
              () => handleTabClick('contracts'),
              activeTab === 'contracts'
            )}
          </li>
          <li>
            {renderNavItem(
              <i className="fas fa-chart-line text-white"></i>,
              'Activity Logs',
              () => handleTabClick('activitylogs'),
              activeTab === 'activitylogs'
            )}
          </li>
          <li>
            {renderNavItem(
              <i className="fas fa-calendar-check text-white"></i>,
              'Leave Request',
              () => handleTabClick('leaverequest'),
              activeTab === 'leaverequest'
            )}
          </li>
          <li>
            {renderNavItem(
              <i className="fas fa-clock text-white"></i>,
              'Time Tracker',
              () => handleTabClick('timetracker'),
              activeTab === 'timetracker'
            )}
          </li>
          <li>
            {renderNavItem(
              <i className="fas fa-clipboard-list text-white"></i>,
              'Notes',
              () => handleTabClick('notes'),
              activeTab === 'notes'
            )}
          </li>
          <li>
            {renderNavItem(
              <i className="fas fa-chart-bar text-white"></i>,
              'Reports',
              handleReportsClick,
              activeTab.startsWith('reports'),
              true,
              reportsDropdownOpen
            )}
            
            {/* Reports Dropdown */}
            {reportsDropdownOpen && (!collapsed || isMobile) && (
              <ul className="ml-8 mt-1 space-y-1">
                <li>
                  <button 
                    onClick={() => handleReportsSubItemClick('projects')}
                    className={`w-full flex items-center space-x-3 p-2 text-left rounded-lg transition-colors text-sm ${
                      activeTab === 'reports-projects' 
                        ? 'bg-white/10 text-white' 
                        : 'text-white hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <i className="fas fa-project-diagram text-white"></i>
                    <span>Projects Report</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleReportsSubItemClick('tasks')}
                    className={`w-full flex items-center space-x-3 p-2 text-left rounded-lg transition-colors text-sm ${
                      activeTab === 'reports-tasks' 
                        ? 'bg-white/10 text-white' 
                        : 'text-white hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <i className="fas fa-tasks text-white"></i>
                    <span>Tasks Report</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleReportsSubItemClick('leads')}
                    className={`w-full flex items-center space-x-3 p-2 text-left rounded-lg transition-colors text-sm ${
                      activeTab === 'reports-leads' 
                        ? 'bg-white/10 text-white' 
                        : 'text-white hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <i className="fas fa-tty text-white"></i>
                    <span>Leads Report</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleReportsSubItemClick('invoices')}
                    className={`w-full flex items-center space-x-3 p-2 text-left rounded-lg transition-colors text-sm ${
                      activeTab === 'reports-invoices' 
                        ? 'bg-white/10 text-white' 
                        : 'text-white hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <i className="fas fa-file-invoice text-white"></i>
                    <span>Invoices Report</span>
                  </button>
                </li>
              </ul>
            )}
          </li>
          <li>
            {renderNavItem(
              <i className="fas fa-user-plus text-white"></i>,
              'System Registrations',
              () => handleTabClick('systemregistrations'),
              activeTab === 'systemregistrations'
            )}
          </li>
          <li>
            {renderNavItem(
              <i className="fas fa-cog text-white"></i>,
              'Settings',
              () => handleTabClick('settings'),
              activeTab === 'settings'
            )}
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
