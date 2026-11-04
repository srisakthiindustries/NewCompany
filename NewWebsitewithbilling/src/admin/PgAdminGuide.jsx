import React, { useState, useEffect } from 'react';
import { Database, Server, Key, ShieldCheck, CheckCircle2, Copy, RefreshCw, Terminal } from 'lucide-react';
import { api } from '../services/api';

export default function PgAdminGuide() {
  const [health, setHealth] = useState(null);
  const [copiedField, setCopiedField] = useState('');
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    setChecking(true);
    try {
      const res = await api.getHealth();
      setHealth(res);
    } catch (err) {
      setHealth({ status: 'ERROR', error: err.message });
    } finally {
      setChecking(false);
    }
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const connectionDetails = [
    { label: 'Host name / address', value: '127.0.0.1' },
    { label: 'Port', value: health?.dbPort ? String(health.dbPort) : '5433' },
    { label: 'Maintenance database', value: 'srisakthi_db' },
    { label: 'Username', value: 'postgres' },
    { label: 'Password', value: 'Beon@994182' },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">PostgreSQL & pgAdmin 4 Local Integration</h2>
          <p className="text-xs text-slate-400 font-mono">
            Connect pgAdmin 4 or any SQL GUI directly to the active Sri Sakthi database cluster.
          </p>
        </div>

        <button
          onClick={checkHealth}
          disabled={checking}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin text-brand-orange' : ''}`} />
          <span>Refresh Database Health</span>
        </button>
      </div>

      {/* Live Health Status Card */}
      <div className="bg-steel-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${health?.status === 'UP' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`}></div>
            <span className="font-bold text-white text-base">
              PostgreSQL Service Status: {health?.status === 'UP' ? 'ONLINE (Ready For pgAdmin)' : 'OFFLINE'}
            </span>
          </div>
          {health?.pgVersion && (
            <span className="px-2.5 py-1 bg-slate-950 rounded text-xs font-mono text-sky-400 border border-slate-800">
              v{health.pgVersion}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
          <div>
            <div className="text-slate-500 font-mono">Connected Database</div>
            <div className="font-bold text-white mt-0.5">{health?.database || 'srisakthi_db'}</div>
          </div>
          <div>
            <div className="text-slate-500 font-mono">Active Port</div>
            <div className="font-bold text-brand-orange font-mono mt-0.5">{health?.dbPort || 5433}</div>
          </div>
          <div>
            <div className="text-slate-500 font-mono">Superuser</div>
            <div className="font-bold text-white font-mono mt-0.5">postgres</div>
          </div>
          <div>
            <div className="text-slate-500 font-mono">Uptime</div>
            <div className="font-bold text-emerald-400 font-mono mt-0.5">{health?.uptimeSeconds || 0}s</div>
          </div>
        </div>
      </div>

      {/* pgAdmin 4 Registration Quick Guide */}
      <div className="bg-steel-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
        <div className="flex items-center space-x-2 text-sm font-bold text-white border-b border-slate-800 pb-3">
          <Server className="w-4 h-4 text-brand-orange" />
          <span>pgAdmin 4 Connection Parameters</span>
        </div>

        <p className="text-xs text-slate-300">
          Open <strong>pgAdmin 4</strong> on your machine, right-click <strong>Servers &gt; Register &gt; Server...</strong>, name it <code>Sri Sakthi Local</code>, and enter these connection details in the <strong>Connection</strong> tab:
        </p>

        <div className="space-y-3 font-mono text-xs">
          {connectionDetails.map((item) => (
            <div key={item.label} className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400 font-sans">{item.label}:</span>
              <div className="flex items-center space-x-2">
                <span className="text-white font-bold">{item.value}</span>
                <button
                  onClick={() => copyToClipboard(item.value, item.label)}
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                  title="Copy"
                >
                  {copiedField === item.label ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* psql CLI command */}
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-sans">
            <span className="flex items-center space-x-1.5">
              <Terminal className="w-3.5 h-3.5 text-brand-orange" />
              <span>Or connect via PowerShell / Command Prompt with psql:</span>
            </span>
          </div>
          <div className="p-2.5 bg-black rounded font-mono text-xs text-emerald-400 flex items-center justify-between overflow-x-auto">
            <span>&amp; "C:\Program Files\PostgreSQL\18\bin\psql.exe" -h 127.0.0.1 -p {health?.dbPort || 5433} -U postgres -d srisakthi_db</span>
            <button
              onClick={() => copyToClipboard(`& "C:\\Program Files\\PostgreSQL\\18\\bin\\psql.exe" -h 127.0.0.1 -p ${health?.dbPort || 5433} -U postgres -d srisakthi_db`, 'cli')}
              className="text-slate-400 hover:text-white ml-2"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

