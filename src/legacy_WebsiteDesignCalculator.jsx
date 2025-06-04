import React, { useState, useEffect } from 'react';
import { Calculator, Clock, Users, FileText, CheckCircle, Target, Zap, Layers, Copy, Check } from 'lucide-react';

const WebsiteDesignCalculator = () => {
  // Main configuration states
  const [uxEnabled, setUxEnabled] = useState(true);
  const [uiEnabled, setUiEnabled] = useState(true);
  const [devHandoverRequired, setDevHandoverRequired] = useState(false);
  const [breakpoints, setBreakpoints] = useState(2);

  // Production states
  const [editPages, setEditPages] = useState(10);
  const [lowPages, setLowPages] = useState(0);

  // Creative Development states
  const [mediumPages, setMediumPages] = useState(4);
  const [mediumCustom, setMediumCustom] = useState(false);
  const [mediumTemplate, setMediumTemplate] = useState(true);
  
  const [highPages, setHighPages] = useState(0);
  const [highCustom, setHighCustom] = useState(false);
  const [highTemplate, setHighTemplate] = useState(true);
  
  const [veryHighPages, setVeryHighPages] = useState(2);
  const [veryHighCustom, setVeryHighCustom] = useState(false);
  const [veryHighTemplate, setVeryHighTemplate] = useState(true);

  // Strategy states
  const [templatesAudit, setTemplatesAudit] = useState(1);
  const [auditRequired, setAuditRequired] = useState(false);
  const [auditComplexity, setAuditComplexity] = useState('Medium');
  const [sitemapBenchmark, setSitemapBenchmark] = useState(false);
  const [sitemapComplexity, setSitemapComplexity] = useState('Medium');

  // Copy functionality
  const [copied, setCopied] = useState(false);

  // Validation
  const isConfigurationValid = () => {
    return uxEnabled || uiEnabled || devHandoverRequired;
  };

  // Calculation functions
  const calculateProductionHours = () => {
    if (!isConfigurationValid()) return 0;
    
    let multiplier = 1;
    if (uxEnabled && uiEnabled) multiplier = 1;
    else if (uxEnabled || uiEnabled) multiplier = 0.6;
    
    // Apply breakpoints multiplier
    const breakpointMultiplier = breakpoints / 2; // Base calculation assumes 2 breakpoints
    
    const editHours = editPages * 1 * multiplier * breakpointMultiplier; // 1 hour per edit page
    const lowHours = lowPages * 2 * multiplier * breakpointMultiplier; // 2 hours per low complexity page
    return editHours + lowHours;
  };

  const calculateCreativeHours = () => {
    if (!isConfigurationValid()) return 0;
    
    let totalHours = 0;
    let multiplier = 1;
    if (uxEnabled && uiEnabled) multiplier = 1;
    else if (uxEnabled || uiEnabled) multiplier = 0.6;
    
    // Apply breakpoints multiplier
    const breakpointMultiplier = breakpoints / 2; // Base calculation assumes 2 breakpoints
    
    // Medium complexity - hours per page
    if (mediumPages > 0) {
      const hoursPerPage = mediumTemplate ? 6.0 : 8.0; // Template: 24/4 pages, Custom: 32/4 pages
      totalHours += mediumPages * hoursPerPage * multiplier * breakpointMultiplier;
    }
    
    // High complexity - hours per page
    if (highPages > 0) {
      const hoursPerPage = highTemplate ? 12.0 : 16.0; // Template: 12 hours, Custom: 16 hours per page
      totalHours += highPages * hoursPerPage * multiplier * breakpointMultiplier;
    }
    
    // Very High complexity - hours per page  
    if (veryHighPages > 0) {
      const hoursPerPage = veryHighTemplate ? 14.0 : 24.0; // Template: 28/2 pages, Custom: 48/2 pages
      totalHours += veryHighPages * hoursPerPage * multiplier * breakpointMultiplier;
    }
    
    return totalHours;
  };

  const calculateStrategyHours = () => {
    let totalHours = 0;
    
    if (auditRequired) {
      const auditHours = {
        'Medium': 3.0,
        'High': 14.0,
        'Very High': 35.0
      };
      totalHours += auditHours[auditComplexity] * templatesAudit;
    }
    
    if (sitemapBenchmark) {
      const sitemapHours = {
        'Medium': 6.0,
        'High': 8.0,
        'Very High': 28.0
      };
      totalHours += sitemapHours[sitemapComplexity];
    }
    
    return totalHours;
  };

  const calculateDevHandoverHours = () => {
    if (!devHandoverRequired) return 0;
    // Dev handover is a fixed 6 hours regardless of breakpoints
    return 6;
  };

  const getTotalHours = () => {
    return calculateProductionHours() + 
           calculateCreativeHours() + 
           calculateStrategyHours() + 
           calculateDevHandoverHours();
  };

  const getProductionComponents = () => {
    let components = 0;
    if (editPages > 0) components++;
    if (lowPages > 0) components++;
    return components;
  };

  const getCreativeComponents = () => {
    let components = 0;
    if (mediumPages > 0) components++;
    if (highPages > 0) components++;
    if (veryHighPages > 0) components++;
    return components;
  };

  const getStrategyComponents = () => {
    let components = 0;
    if (auditRequired && templatesAudit > 0) components++;
    if (sitemapBenchmark) components++;
    return components;
  };

  const getTotalComponents = () => {
    return getProductionComponents() + getCreativeComponents() + getStrategyComponents();
  };

  const getProjectLength = () => {
    return Math.ceil(getTotalHours() / 4.13); // Assuming ~4.13 hours per business day
  };

  const generateDetailedBreakdown = () => {
    let details = [];
    
    // Production details
    if (editPages > 0 || lowPages > 0) {
      details.push("Production:");
      if (editPages > 0) details.push(`• ${editPages} edit pages`);
      if (lowPages > 0) details.push(`• ${lowPages} low complexity templates`);
      details.push("");
    }
    
    // Creative Development details
    if (mediumPages > 0 || highPages > 0 || veryHighPages > 0) {
      details.push("Creative Development:");
      if (mediumPages > 0) details.push(`• ${mediumPages} medium complexity pages (${mediumCustom ? 'custom' : 'template'})`);
      if (highPages > 0) details.push(`• ${highPages} high complexity pages (${highCustom ? 'custom' : 'template'})`);
      if (veryHighPages > 0) details.push(`• ${veryHighPages} very high complexity pages (${veryHighCustom ? 'custom' : 'template'})`);
      details.push("");
    }
    
    // Strategy details
    if (auditRequired || sitemapBenchmark) {
      details.push("Strategy:");
      if (auditRequired) details.push(`• Audit: ${templatesAudit} templates (${auditComplexity.toLowerCase()} complexity)`);
      if (sitemapBenchmark) details.push(`• Sitemap & Benchmark (${sitemapComplexity.toLowerCase()} complexity)`);
      details.push("");
    }
    
    // Configuration details
    details.push("Configuration:");
    const services = [];
    if (uxEnabled) services.push("UX");
    if (uiEnabled) services.push("UI");
    if (devHandoverRequired) services.push("Dev Handover");
    details.push(`• Services: ${services.join(", ")}`);
    details.push(`• Breakpoints: ${breakpoints}`);
    
    return details.join("\n");
  };

  const copyToClipboard = async () => {
    const breakdown = `Website Design Project Estimate

Total Hours: ${getTotalHours().toFixed(1)}
Timeline: ${getProjectLength()} business days

Hours Breakdown:
• Production: ${calculateProductionHours().toFixed(1)} hours
• Creative Development: ${calculateCreativeHours().toFixed(1)} hours
• Strategy: ${calculateStrategyHours().toFixed(1)} hours
• Dev Handover: ${calculateDevHandoverHours().toFixed(1)} hours

Project Details:
${generateDetailedBreakdown()}`;

    try {
      await navigator.clipboard.writeText(breakdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              Website Design Calculator
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Calculate your web design project
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Use this calculator when you need to quote UX or UI individually. Get accurate estimates for your website design projects with our comprehensive calculator.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Summary Cards */}
        <div className="space-y-6 mb-12">
          {/* Top Row - Total Hours and Business Days */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Total Hours</h3>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{getTotalHours().toFixed(1)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Bus. Days</h3>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{getProjectLength()}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Row - Component Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-md font-semibold text-gray-900">Production</h3>
                  <p className="text-xl font-bold text-gray-900 mt-1">{calculateProductionHours().toFixed(1)}h</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Layers className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-md font-semibold text-gray-900">Creative Dev</h3>
                  <p className="text-xl font-bold text-gray-900 mt-1">{calculateCreativeHours().toFixed(1)}h</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-md font-semibold text-gray-900">Strategy</h3>
                  <p className="text-xl font-bold text-gray-900 mt-1">{calculateStrategyHours().toFixed(1)}h</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-md font-semibold text-gray-900">Dev Handover</h3>
                  <p className="text-xl font-bold text-gray-900 mt-1">{calculateDevHandoverHours().toFixed(1)}h</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="xl:col-span-2 space-y-8">
            {/* Project Configuration */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Configuration</h2>
              
              {!isConfigurationValid() && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                    <p className="text-red-700 font-medium">
                      Please select at least one option (UX, UI, or Dev Handover) to proceed with the calculation.
                    </p>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={uxEnabled}
                      onChange={(e) => setUxEnabled(e.target.checked)}
                      className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 focus:ring-2"
                    />
                    <div>
                      <span className="font-semibold text-gray-900">UX - Wireframes</span>
                      <p className="text-sm text-gray-600 mt-1">Structure, interaction and user experience definition</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={uiEnabled}
                      onChange={(e) => setUiEnabled(e.target.checked)}
                      className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 focus:ring-2"
                    />
                    <div>
                      <span className="font-semibold text-gray-900">UI - User Interface</span>
                      <p className="text-sm text-gray-600 mt-1">Graphical user interfaces creation</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={devHandoverRequired}
                      onChange={(e) => setDevHandoverRequired(e.target.checked)}
                      className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 focus:ring-2"
                    />
                    <div>
                      <span className="font-semibold text-gray-900">Dev Handover Required</span>
                      <p className="text-sm text-gray-600 mt-1">Only applicable if Webflow development is required</p>
                    </div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Number of Breakpoints
                  </label>
                  <input
                    type="number"
                    value={breakpoints}
                    onChange={(e) => setBreakpoints(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                    min="1"
                    max="5"
                  />
                  <p className="text-sm text-gray-600 mt-2">Desktop, Tablet, Mobile breakpoints (minimum 1)</p>
                </div>
              </div>
            </div>

            {/* Production Section */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Production</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Edits (Number of pages to edit)
                  </label>
                  <input
                    type="number"
                    value={editPages}
                    onChange={(e) => setEditPages(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                    min="0"
                  />
                  <p className="text-sm text-gray-600 mt-2">Edit copy and images, without changing structure</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Low (Number of templates to customize)
                  </label>
                  <input
                    type="number"
                    value={lowPages}
                    onChange={(e) => setLowPages(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                    min="0"
                  />
                  <p className="text-sm text-gray-600 mt-2">Adding content to existing templates</p>
                </div>
              </div>
            </div>

            {/* Creative Development Section */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Creative Development</h2>
              <div className="space-y-8">
                {/* Medium Complexity */}
                <div className="border-l-4 border-yellow-400 pl-6 bg-yellow-50 rounded-r-xl py-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Medium Complexity</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Number of Pages</label>
                      <input
                        type="number"
                        value={mediumPages}
                        onChange={(e) => setMediumPages(parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Design Type</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            checked={!mediumCustom}
                            onChange={() => {setMediumCustom(false); setMediumTemplate(true);}}
                            className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-sm font-medium text-gray-700">Template</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            checked={mediumCustom}
                            onChange={() => {setMediumCustom(true); setMediumTemplate(false);}}
                            className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-sm font-medium text-gray-700">Custom</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">Contact, Testimonials, Reviews, FAQ, Legal, Error/404</p>
                </div>

                {/* High Complexity */}
                <div className="border-l-4 border-orange-400 pl-6 bg-orange-50 rounded-r-xl py-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">High Complexity</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Number of Pages</label>
                      <input
                        type="number"
                        value={highPages}
                        onChange={(e) => setHighPages(parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Design Type</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            checked={!highCustom}
                            onChange={() => {setHighCustom(false); setHighTemplate(true);}}
                            className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-sm font-medium text-gray-700">Template</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            checked={highCustom}
                            onChange={() => {setHighCustom(true); setHighTemplate(false);}}
                            className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-sm font-medium text-gray-700">Custom</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">About, Product Grid, Solutions, Case Studies, Blog, Services, Careers</p>
                </div>

                {/* Very High Complexity */}
                <div className="border-l-4 border-red-400 pl-6 bg-red-50 rounded-r-xl py-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Very High Complexity</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Number of Pages</label>
                      <input
                        type="number"
                        value={veryHighPages}
                        onChange={(e) => setVeryHighPages(parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Design Type</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            checked={!veryHighCustom}
                            onChange={() => {setVeryHighCustom(false); setVeryHighTemplate(true);}}
                            className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-sm font-medium text-gray-700">Template</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            checked={veryHighCustom}
                            onChange={() => {setVeryHighCustom(true); setVeryHighTemplate(false);}}
                            className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-sm font-medium text-gray-700">Custom</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">Homepage, Pricing, Demo, Landing Pages</p>
                </div>
              </div>
            </div>

            {/* Strategy Section */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Strategy Calculator</h2>
              <div className="space-y-6">
                {/* Audit Section */}
                <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={auditRequired}
                        onChange={(e) => setAuditRequired(e.target.checked)}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 focus:ring-2"
                      />
                      <span className="text-lg font-semibold text-gray-900">Audit Required?</span>
                    </label>
                  </div>
                  
                  {auditRequired && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                          Number of templates to audit
                        </label>
                        <input
                          type="number"
                          value={templatesAudit}
                          onChange={(e) => setTemplatesAudit(parseInt(e.target.value) || 0)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                          min="0"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                          Audit Complexity
                        </label>
                        <select
                          value={auditComplexity}
                          onChange={(e) => setAuditComplexity(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                        >
                          <option value="Medium">Medium - Design Review + Accessibility</option>
                          <option value="High">High - + UX/UI Recommendations</option>
                          <option value="Very High">Very High - + User Journey</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sitemap Section */}
                <div className="p-6 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3 mb-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sitemapBenchmark}
                        onChange={(e) => setSitemapBenchmark(e.target.checked)}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 focus:ring-2"
                      />
                      <span className="text-lg font-semibold text-gray-900">Sitemap & Competitors Benchmark</span>
                    </label>
                  </div>

                  {sitemapBenchmark && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-3">
                        Sitemap Complexity
                      </label>
                      <select
                        value={sitemapComplexity}
                        onChange={(e) => setSitemapComplexity(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                      >
                        <option value="Medium">Medium - Simple Sitemap Revision</option>
                        <option value="High">High - Competitors Benchmark</option>
                        <option value="Very High">Very High - Complete Package</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-8">
            {/* Detailed Breakdown */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Project Breakdown</h2>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Hours Summary */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <div>
                      <span className="font-medium text-gray-700">Production</span>
                      <div className="text-xs text-gray-500 mt-1">
                        {editPages > 0 && <div>• {editPages} edit pages</div>}
                        {lowPages > 0 && <div>• {lowPages} low complexity templates</div>}
                      </div>
                    </div>
                    <span className="font-bold text-lg text-blue-600">{calculateProductionHours().toFixed(1)}h</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <div>
                      <span className="font-medium text-gray-700">Creative Development</span>
                      <div className="text-xs text-gray-500 mt-1">
                        {mediumPages > 0 && <div>• {mediumPages} medium pages ({mediumCustom ? 'custom' : 'template'})</div>}
                        {highPages > 0 && <div>• {highPages} high pages ({highCustom ? 'custom' : 'template'})</div>}
                        {veryHighPages > 0 && <div>• {veryHighPages} very high pages ({veryHighCustom ? 'custom' : 'template'})</div>}
                      </div>
                    </div>
                    <span className="font-bold text-lg text-green-600">{calculateCreativeHours().toFixed(1)}h</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <div>
                      <span className="font-medium text-gray-700">Strategy</span>
                      <div className="text-xs text-gray-500 mt-1">
                        {auditRequired && <div>• Audit: {templatesAudit} templates ({auditComplexity.toLowerCase()})</div>}
                        {sitemapBenchmark && <div>• Sitemap & Benchmark ({sitemapComplexity.toLowerCase()})</div>}
                      </div>
                    </div>
                    <span className="font-bold text-lg text-orange-600">{calculateStrategyHours().toFixed(1)}h</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <div>
                      <span className="font-medium text-gray-700">Dev Handover</span>
                      <div className="text-xs text-gray-500 mt-1">
                        {devHandoverRequired && <div>• Fixed 6 hours for handover</div>}
                      </div>
                    </div>
                    <span className="font-bold text-lg text-purple-600">{calculateDevHandoverHours().toFixed(1)}h</span>
                  </div>
                </div>
                
                {/* Project Configuration */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-3">Configuration</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Services:</span>
                      <span className="font-medium text-gray-900">
                        {[uxEnabled && 'UX', uiEnabled && 'UI', devHandoverRequired && 'Dev Handover'].filter(Boolean).join(', ')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Breakpoints:</span>
                      <span className="font-medium text-gray-900">{breakpoints}</span>
                    </div>
                  </div>
                </div>
                
                {/* Final Totals */}
                <div className="flex justify-between items-center py-4 bg-purple-50 px-4 rounded-xl border-2 border-purple-200">
                  <div>
                    <span className="font-bold text-lg text-gray-900">Total Project</span>
                    <p className="text-sm text-gray-600">{getTotalComponents()} total components</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-2xl text-purple-600">{getTotalHours().toFixed(1)} hours</div>
                    <div className="text-sm font-medium text-purple-600">{getProjectLength()} business days</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Definitions */}
            <div className="bg-purple-50 rounded-2xl p-8 border border-purple-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Definitions</h2>
              <div className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <span className="font-semibold text-purple-700 min-w-0">UX:</span>
                  <span className="text-gray-700">Structure, interaction and user experience definition</span>
                </div>
                <div className="flex gap-3">
                  <span className="font-semibold text-purple-700 min-w-0">UI:</span>
                  <span className="text-gray-700">Graphical user interfaces creation</span>
                </div>
                <div className="flex gap-3">
                  <span className="font-semibold text-purple-700 min-w-0">Breakpoints:</span>
                  <span className="text-gray-700">Number of device sizes to design for (Desktop, Tablet, Mobile)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <p className="text-center text-sm text-gray-500">
            Made by Motza with <span className="text-red-500">♥</span> using Claude AI
          </p>
        </div>
      </div>
    </div>
  );
};

export default WebsiteDesignCalculator;
