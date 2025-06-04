import React, { useState } from 'react';

const App = () => {
  // Main configuration
  const [uxEnabled, setUxEnabled] = useState(true);
  const [uiEnabled, setUiEnabled] = useState(true);
  const [devHandoverRequired, setDevHandoverRequired] = useState(false);
  const [breakpoints, setBreakpoints] = useState(2);

  // Production
  const [editPages, setEditPages] = useState(10);
  const [lowPages, setLowPages] = useState(0);

  // Creative development
  const [mediumPages, setMediumPages] = useState(4);
  const [mediumCustom, setMediumCustom] = useState(false);
  const [highPages, setHighPages] = useState(0);
  const [highCustom, setHighCustom] = useState(false);
  const [veryHighPages, setVeryHighPages] = useState(2);
  const [veryHighCustom, setVeryHighCustom] = useState(false);

  // Strategy
  const [templatesAudit, setTemplatesAudit] = useState(1);
  const [auditRequired, setAuditRequired] = useState(false);
  const [auditComplexity, setAuditComplexity] = useState('Medium');
  const [sitemapBenchmark, setSitemapBenchmark] = useState(false);
  const [sitemapComplexity, setSitemapComplexity] = useState('Medium');

  const isConfigurationValid = () => uxEnabled || uiEnabled || devHandoverRequired;

  const calculateProductionHours = () => {
    if (!isConfigurationValid()) return 0;
    let multiplier = uxEnabled && uiEnabled ? 1 : (uxEnabled || uiEnabled ? 0.6 : 1);
    const bp = breakpoints / 2;
    return editPages * 1 * multiplier * bp + lowPages * 2 * multiplier * bp;
  };

  const calculateCreativeHours = () => {
    if (!isConfigurationValid()) return 0;
    let total = 0;
    let multiplier = uxEnabled && uiEnabled ? 1 : (uxEnabled || uiEnabled ? 0.6 : 1);
    const bp = breakpoints / 2;

    if (mediumPages > 0) {
      const hrs = mediumCustom ? 8 : 6;
      total += mediumPages * hrs * multiplier * bp;
    }

    if (highPages > 0) {
      const hrs = highCustom ? 16 : 12;
      total += highPages * hrs * multiplier * bp;
    }

    if (veryHighPages > 0) {
      const hrs = veryHighCustom ? 24 : 14;
      total += veryHighPages * hrs * multiplier * bp;
    }
    return total;
  };

  const calculateStrategyHours = () => {
    let total = 0;
    if (auditRequired) {
      const hours = { Medium: 3, High: 14, 'Very High': 35 };
      total += hours[auditComplexity] * templatesAudit;
    }
    if (sitemapBenchmark) {
      const hours = { Medium: 6, High: 8, 'Very High': 28 };
      total += hours[sitemapComplexity];
    }
    return total;
  };

  const calculateDevHandoverHours = () => devHandoverRequired ? 6 : 0;

  const getTotalHours = () =>
    calculateProductionHours() + calculateCreativeHours() + calculateStrategyHours() + calculateDevHandoverHours();

  const getProjectLength = () => Math.ceil(getTotalHours() / 4.13);

  const generateBreakdown = () => {
    const lines = [];
    if (editPages > 0 || lowPages > 0) {
      lines.push('Production:');
      if (editPages > 0) lines.push(`• ${editPages} edit pages`);
      if (lowPages > 0) lines.push(`• ${lowPages} low complexity templates`);
      lines.push('');
    }
    if (mediumPages > 0 || highPages > 0 || veryHighPages > 0) {
      lines.push('Creative Development:');
      if (mediumPages > 0) lines.push(`• ${mediumPages} medium pages (${mediumCustom ? 'custom' : 'template'})`);
      if (highPages > 0) lines.push(`• ${highPages} high pages (${highCustom ? 'custom' : 'template'})`);
      if (veryHighPages > 0) lines.push(`• ${veryHighPages} very high pages (${veryHighCustom ? 'custom' : 'template'})`);
      lines.push('');
    }
    if (auditRequired || sitemapBenchmark) {
      lines.push('Strategy:');
      if (auditRequired) lines.push(`• Audit ${templatesAudit} templates (${auditComplexity.toLowerCase()})`);
      if (sitemapBenchmark) lines.push(`• Sitemap & Benchmark (${sitemapComplexity.toLowerCase()})`);
      lines.push('');
    }
    lines.push('Configuration:');
    const services = [];
    if (uxEnabled) services.push('UX');
    if (uiEnabled) services.push('UI');
    if (devHandoverRequired) services.push('Dev Handover');
    lines.push(`• Services: ${services.join(', ')}`);
    lines.push(`• Breakpoints: ${breakpoints}`);
    return lines.join('\n');
  };

  const copyToClipboard = async () => {
    const text = `Website Design Project Estimate\n\nTotal Hours: ${getTotalHours().toFixed(1)}\nTimeline: ${getProjectLength()} business days\n\nHours Breakdown:\n• Production: ${calculateProductionHours().toFixed(1)} hours\n• Creative Development: ${calculateCreativeHours().toFixed(1)} hours\n• Strategy: ${calculateStrategyHours().toFixed(1)} hours\n• Dev Handover: ${calculateDevHandoverHours().toFixed(1)} hours\n\nProject Details:\n${generateBreakdown()}`;
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied breakdown to clipboard');
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '1rem' }}>
      <h1>Website Design Calculator</h1>
      <section>
        <h2>Services</h2>
        <label><input type="checkbox" checked={uxEnabled} onChange={e => setUxEnabled(e.target.checked)} /> UX</label>
        <label><input type="checkbox" checked={uiEnabled} onChange={e => setUiEnabled(e.target.checked)} /> UI</label>
        <label><input type="checkbox" checked={devHandoverRequired} onChange={e => setDevHandoverRequired(e.target.checked)} /> Dev Handover</label>
        <div>Breakpoints <input type="number" value={breakpoints} min="1" onChange={e => setBreakpoints(Number(e.target.value))} /></div>
      </section>

      <section>
        <h2>Production</h2>
        <div>Edit pages <input type="number" value={editPages} min="0" onChange={e => setEditPages(Number(e.target.value))} /></div>
        <div>Low complexity pages <input type="number" value={lowPages} min="0" onChange={e => setLowPages(Number(e.target.value))} /></div>
      </section>

      <section>
        <h2>Creative Development</h2>
        <div>Medium pages <input type="number" value={mediumPages} min="0" onChange={e => setMediumPages(Number(e.target.value))} /></div>
        <label><input type="checkbox" checked={mediumCustom} onChange={e => setMediumCustom(e.target.checked)} /> Custom design</label>
        <div>High pages <input type="number" value={highPages} min="0" onChange={e => setHighPages(Number(e.target.value))} /></div>
        <label><input type="checkbox" checked={highCustom} onChange={e => setHighCustom(e.target.checked)} /> Custom design</label>
        <div>Very high pages <input type="number" value={veryHighPages} min="0" onChange={e => setVeryHighPages(Number(e.target.value))} /></div>
        <label><input type="checkbox" checked={veryHighCustom} onChange={e => setVeryHighCustom(e.target.checked)} /> Custom design</label>
      </section>

      <section>
        <h2>Strategy</h2>
        <label><input type="checkbox" checked={auditRequired} onChange={e => setAuditRequired(e.target.checked)} /> Audit</label>
        {auditRequired && (
          <div>
            Templates <input type="number" value={templatesAudit} min="1" onChange={e => setTemplatesAudit(Number(e.target.value))} />
            <select value={auditComplexity} onChange={e => setAuditComplexity(e.target.value)}>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Very High">Very High</option>
            </select>
          </div>
        )}
        <label><input type="checkbox" checked={sitemapBenchmark} onChange={e => setSitemapBenchmark(e.target.checked)} /> Sitemap & Benchmark</label>
        {sitemapBenchmark && (
          <div>
            <select value={sitemapComplexity} onChange={e => setSitemapComplexity(e.target.value)}>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Very High">Very High</option>
            </select>
          </div>
        )}
      </section>

      <hr />
      <p>Total hours: {getTotalHours().toFixed(1)}</p>
      <p>Project length: {getProjectLength()} business days</p>
      <button onClick={copyToClipboard}>Copy breakdown</button>
    </div>
  );
};

export default App;
