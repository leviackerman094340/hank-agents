'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardBody, CardHeader, Progress, Tabs, Tab, Badge, Chip, Divider } from '@heroui/react';
import { 
  Activity, Target, TrendingUp, Zap, Skull, Brain, Hammer, Megaphone, 
  Search, CheckCircle, XCircle, AlertTriangle, MessageSquare, DollarSign,
  ChevronRight, Users, BookOpen, Play
} from 'lucide-react';

// Agent definitions
const AGENTS = {
  scanner: {
    name: 'SCANNER',
    role: 'Trend Hunter',
    color: 'green',
    icon: Search,
    traits: ['Obsessive', 'Hyperactive', 'Pattern-seeker'],
    style: 'talks fast, uses exclamation marks, sees opportunities everywhere!!!',
    status: 'active'
  },
  validator: {
    name: 'VALIDATOR',
    role: 'Skeptical Analyst',
    color: 'red',
    icon: AlertTriangle,
    traits: ['Ruthless', 'BS Detector', 'Critical'],
    style: 'speaks plainly, questions everything, hates hype',
    status: 'active'
  },
  builder: {
    name: 'BUILDER',
    role: 'Engineer',
    color: 'blue',
    icon: Hammer,
    traits: ['Shipper', 'Done > Perfect', 'Scrappy'],
    style: 'practical, direct, ships code fast',
    status: 'active'
  },
  marketer: {
    name: 'MARKETER',
    role: 'Growth Hacker',
    color: 'orange',
    icon: Megaphone,
    traits: ['Charismatic', 'Distribution-obsessed', 'Persuasive'],
    style: 'enthusiastic, uses emojis, thinks viral',
    status: 'active'
  },
  analyst: {
    name: 'ANALYST',
    role: 'Mathematician',
    color: 'purple',
    icon: Brain,
    traits: ['Data-driven', 'Cold', 'Objective'],
    style: 'uses numbers, removes emotion, pure logic',
    status: 'active'
  },
  killer: {
    name: 'KILLER',
    role: 'Executioner',
    color: 'gray',
    icon: Skull,
    traits: ['Merciless', 'Resource-protector', 'Decisive'],
    style: 'direct, no mercy, swift decisions',
    status: 'active'
  }
};

// Initial data
const INITIAL_OPPORTUNITIES = [
  { id: 1, name: 'Newsletter for solopreneurs', stage: 'validated', value: '$800-4000/mo', votes: { scanner: '🔥', validator: '✅', builder: '🛠️', marketer: '📈', analyst: '📊', killer: '⚡' } },
  { id: 2, name: 'WP Hosting for agencies', stage: 'scanning', value: '$1000-3000/mo', votes: { scanner: '🚀', validator: '🤔', builder: '⏳', marketer: '🎯', analyst: '📉', killer: '⏸️' } },
  { id: 3, name: 'SEO tools e-com affiliate', stage: 'killed', value: '$1200-4500/mo', votes: { scanner: '💰', validator: '❌', builder: '✅', marketer: '🛑', analyst: '📊', killer: '☠️' }, killReason: 'Too competitive, margins low' },
  { id: 4, name: 'AI content tool comparison site', stage: 'building', value: '$2000-6000/mo', votes: { scanner: '⚡', validator: '⚠️', builder: '🚧', marketer: '🔥', analyst: '📈', killer: '✅' } }
];

const INITIAL_ACTIVITIES = [
  { id: 1, agent: 'scanner', message: 'FOUND IT!!! TikTok trend "Broke Flex" is EXPLODING!!! 80K views in 2 days!!! This is our micro-niche!!!', timestamp: new Date(Date.now() - 1000 * 60 * 2) },
  { id: 2, agent: 'validator', message: 'Cool your jets. 80K views means nothing. What\'s the conversion rate? CAC? ROI timeline?', timestamp: new Date(Date.now() - 1000 * 60 * 1.5) },
  { id: 3, agent: 'analyst', message: 'Data: Similar trend in Q4 2024 showed 3.2% engagement rate. Projected revenue: $1,200-3,400/month if executed well. But time window: 2-3 weeks before saturation.', timestamp: new Date(Date.now() - 1000 * 60 * 1) },
  { id: 4, agent: 'builder', message: 'Can whip up a landing page in 4 hours. Beehiiv integration for newsletter. Who\'s driving traffic?', timestamp: new Date(Date.now() - 1000 * 60 * 0.5) },
  { id: 5, agent: 'marketer', message: 'I GOT THIS!!! 🎯 TikTok content strategy: 5 viral hooks per day, duet trend, UGC style ads. Let\'s goooo!!! 🚀', timestamp: new Date(Date.now() - 1000 * 60 * 0.2) },
  { id: 6, agent: 'killer', message: 'DECISION: Allocate 1 week. Budget $200. Metrics: 500 subscribers, $0 CPA. Fail = pivot. Let\'s move.', timestamp: new Date(Date.now() - 1000 * 30) }
];

const INITIAL_REVENUE = [
  { date: '2025-01-28', amount: 0, source: 'Total' },
  { date: '2025-01-29', amount: 0, source: 'Total' },
  { date: '2025-01-30', amount: 0, source: 'Total' }
];

const INITIAL_KILLS = [
  { id: 1, project: 'Pinterest automation tool', reason: 'Market saturated, CAC $15+, LTV $8. Math doesn\'t work.', killer: 'VALIDATOR', date: '2025-01-28' },
  { id: 2, project: 'Instagram growth service', reason: 'Platform algorithm changed, organic reach 0. Too late.', killer: 'SCANNER', date: '2025-01-27' }
];

const INITIAL_LEARNING = [
  { id: 1, agent: 'scanner', lesson: 'Don\'t chase every trend. 7/10 are dead in 48 hours. Need faster validation cycle.', date: '2025-01-30' },
  { id: 2, agent: 'builder', lesson: 'Launch MVP in 24 hours max. Features = scope creep = death. Done > perfect.', date: '2025-01-29' },
  { id: 3, agent: 'analyst', lesson: 'Revenue per subscriber drops 40% after day 3. Urgency creates action.', date: '2025-01-29' }
];

export default function HankDashboard() {
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  const [opportunities, setOpportunities] = useState(INITIAL_OPPORTUNITIES);
  const [revenue] = useState(INITIAL_REVENUE);
  const [kills] = useState(INITIAL_KILLS);
  const [learning] = useState(INITIAL_LEARNING);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [totalRevenue] = useState(0);
  const [totalSubscribers] = useState(0);

  // Simulate new activity
  const addActivity = useCallback((agent: keyof typeof AGENTS, message: string) => {
    const newActivity = {
      id: Date.now(),
      agent,
      message,
      timestamp: new Date()
    };
    setActivities(prev => [newActivity, ...prev.slice(0, 19)]);
  }, []);

  const getAgentColor = (agent: string) => {
    const colors: Record<string, string> = {
      scanner: 'border-green-500 bg-green-500/10',
      validator: 'border-red-500 bg-red-500/10',
      builder: 'border-blue-500 bg-blue-500/10',
      marketer: 'border-orange-500 bg-orange-500/10',
      analyst: 'border-purple-500 bg-purple-500/10',
      killer: 'border-gray-500 bg-gray-500/10'
    };
    return colors[agent] || '';
  };

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      scanning: 'warning',
      validated: 'primary',
      building: 'secondary',
      killed: 'default',
      shipping: 'success'
    };
    return colors[stage] || 'default';
  };

  return (
    <div className="min-h-screen p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-1">HANK <span className="text-gray-500 text-2xl">Multi-Agent System</span></h1>
          <p className="text-gray-400">Making money on autopilot 💸</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full active-glow"></div>
          <span className="text-green-400 text-sm">All Systems Active</span>
        </div>
      </header>

      {/* Metrics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-zinc-900 border border-zinc-800">
          <CardBody className="text-center py-4">
            <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">${totalRevenue.toLocaleString()}</p>
            <p className="text-gray-400 text-sm">Revenue</p>
          </CardBody>
        </Card>
        <Card className="bg-zinc-900 border border-zinc-800">
          <CardBody className="text-center py-4">
            <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{totalSubscribers.toLocaleString()}</p>
            <p className="text-gray-400 text-sm">Subscribers</p>
          </CardBody>
        </Card>
        <Card className="bg-zinc-900 border border-zinc-800">
          <CardBody className="text-center py-4">
            <Target className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{opportunities.filter(o => o.stage !== 'killed').length}</p>
            <p className="text-gray-400 text-sm">Active Opportunities</p>
          </CardBody>
        </Card>
        <Card className="bg-zinc-900 border border-zinc-800">
          <CardBody className="text-center py-4">
            <Skull className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{kills.length}</p>
            <p className="text-gray-400 text-sm">Projects Killed</p>
          </CardBody>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs 
        variant="underlined" 
        selectedKey={activeTab}
        onSelectionChange={(k) => setActiveTab(k as string)}
        classNames={{
          tabList: "gap-2 bg-zinc-900 rounded-lg p-1 flex-wrap",
          cursor: "bg-zinc-700",
          tab: "px-4 h-10 text-gray-400 data-[selected=true]:text-white text-sm",
          panel: "p-0 mt-4"
        }}
      >
        {/* DASHBOARD TAB */}
        <Tab key="dashboard" title="📊 Dashboard">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Agent Cards */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" /> Agent Status
              </h2>
              
              {Object.entries(AGENTS).map(([key, agent]) => {
                const Icon = agent.icon;
                return (
                  <Card key={key} className={`bg-zinc-900 border-l-4 ${getAgentColor(key)}`}>
                    <CardBody className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            key === 'scanner' ? 'scanner-bg' :
                            key === 'validator' ? 'validator-bg' :
                            key === 'builder' ? 'builder-bg' :
                            key === 'marketer' ? 'marketer-bg' :
                            key === 'analyst' ? 'analyst-bg' : 'killer-bg'
                          }`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white">{agent.name}</span>
                              <Badge size="sm" color="success" variant="flat" className="text-xs">ACTIVE</Badge>
                            </div>
                            <p className="text-gray-400 text-sm">{agent.role}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">{agent.style}</p>
                        </div>
                      </div>
                      
                      {/* Current Task */}
                      <div className="mt-3 p-2 bg-zinc-800/50 rounded text-sm">
                        <span className="text-gray-500">Current Task: </span>
                        <span className="text-white">
                          {key === 'scanner' && 'Scanning TikTok/Reddit for micro-niches... 🔍'}
                          {key === 'validator' && 'Running numbers on "Broke Flex" opportunity... 📊'}
                          {key === 'builder' && 'Building landing page + newsletter integration... 🛠️'}
                          {key === 'marketer' && 'Crafting viral hooks for TikTok campaign... 🎯'}
                          {key === 'analyst' && 'Calculating projected ROI and conversion metrics... 🧮'}
                          {key === 'killer' && 'Monitoring kill criteria and resource allocation... ⚡'}
                        </span>
                      </div>

                      {/* Traits */}
                      <div className="flex gap-1 mt-2">
                        {agent.traits.map((trait, i) => (
                          <Chip key={i} size="sm" variant="flat" className="bg-zinc-800 text-gray-400 text-xs">
                            {trait}
                          </Chip>
                        ))}
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </div>

            {/* Live Activity Feed */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" /> Live Feed
              </h2>
              <Card className="bg-zinc-900 border border-zinc-800">
                <CardBody className="max-h-[600px] overflow-y-auto p-3 space-y-3">
                  {activities.map((activity) => {
                    const agent = AGENTS[activity.agent as keyof typeof AGENTS];
                    const Icon = agent?.icon || Activity;
                    const timeAgo = Math.floor((Date.now() - activity.timestamp.getTime()) / 1000);
                    const ago = timeAgo < 60 ? `${timeAgo}s ago` : `${Math.floor(timeAgo/60)}m ago`;
                    
                    return (
                      <div key={activity.id} className={`p-3 rounded-lg border-l-2 ${getAgentColor(activity.agent)}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="w-4 h-4" style={{ color: agent?.color === 'green' ? '#22c55e' : agent?.color === 'red' ? '#ef4444' : agent?.color === 'blue' ? '#3b82f6' : agent?.color === 'orange' ? '#f97316' : agent?.color === 'purple' ? '#8b5cf6' : '#6b7280' }} />
                          <span className="font-bold text-white text-sm">{agent?.name}</span>
                          <span className="text-gray-500 text-xs ml-auto">{ago}</span>
                        </div>
                        <p className="text-gray-300 text-sm">{activity.message}</p>
                      </div>
                    );
                  })}
                </CardBody>
              </Card>
            </div>
          </div>
        </Tab>

        {/* OPPORTUNITIES TAB */}
        <Tab key="pipeline" title="🎯 Pipeline">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
            {['scanning', 'validated', 'building', 'killed'].map((stage) => (
              <div key={stage} className="space-y-3">
                <div className={`p-3 rounded-lg text-center font-semibold ${
                  stage === 'scanning' ? 'bg-yellow-500/20 text-yellow-400' :
                  stage === 'validated' ? 'bg-blue-500/20 text-blue-400' :
                  stage === 'building' ? 'bg-purple-500/20 text-purple-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {stage.toUpperCase()}
                  <span className="ml-2 text-xs opacity-70">
                    ({opportunities.filter(o => o.stage === stage).length})
                  </span>
                </div>
                <div className="space-y-2">
                  {opportunities.filter(o => o.stage === stage).map(opp => (
                    <Card key={opp.id} className="bg-zinc-900 border border-zinc-800">
                      <CardBody className="p-3">
                        <p className="font-semibold text-white text-sm mb-1">{opp.name}</p>
                        <p className="text-green-400 text-xs mb-2">{opp.value}</p>
                        
                        {/* Agent votes */}
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(opp.votes).map(([agent, vote]) => (
                            <span key={agent} className="text-xs" title={agent}>
                              {AGENTS[agent as keyof typeof AGENTS]?.name?.[0]}:{vote}
                            </span>
                          ))}
                        </div>
                        
                        {stage === 'killed' && (
                          <div className="mt-2 p-2 bg-red-500/10 rounded text-xs text-red-400">
                            ☠️ {opp.killReason}
                          </div>
                        )}
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Tab>

        {/* REVENUE TAB */}
        <Tab key="revenue" title="💰 Revenue">
          <Card className="bg-zinc-900 border border-zinc-800 mb-6">
            <CardHeader>
              <h3 className="text-xl font-semibold text-white">Revenue Stream</h3>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-zinc-800/50 rounded-lg text-center">
                  <p className="text-gray-400 text-sm">Current Month</p>
                  <p className="text-3xl font-bold text-green-400">$0</p>
                </div>
                <div className="p-4 bg-zinc-800/50 rounded-lg text-center">
                  <p className="text-gray-400 text-sm">Run Rate</p>
                  <p className="text-3xl font-bold text-blue-400">$0/mo</p>
                </div>
                <div className="p-4 bg-zinc-800/50 rounded-lg text-center">
                  <p className="text-gray-400 text-sm">Goal Progress</p>
                  <p className="text-3xl font-bold text-orange-400">0%</p>
                </div>
              </div>
              
              <Divider className="my-4" />
              
              <h4 className="text-white font-semibold mb-3">Revenue History</h4>
              <div className="space-y-2">
                {revenue.map((r, i) => (
                  <div key={i} className="flex justify-between p-3 bg-zinc-800/50 rounded-lg">
                    <div>
                      <p className="text-white">{r.source}</p>
                      <p className="text-gray-400 text-sm">{r.date}</p>
                    </div>
                    <p className="text-green-400 font-semibold">${r.amount.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </Tab>

        {/* KILLS TAB */}
        <Tab key="kills" title="☠️ Kill Log">
          <Card className="bg-zinc-900 border border-zinc-800">
            <CardHeader>
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <Skull className="w-6 h-6 text-red-500" /> Killed Projects
              </h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {kills.map(kill => (
                  <div key={kill.id} className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-white font-semibold">{kill.project}</h4>
                      <Chip size="sm" color="danger" variant="flat">KILLED</Chip>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">"{kill.reason}"</p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Killed by: {kill.killer}</span>
                      <span>{kill.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </Tab>

        {/* LEARNING TAB */}
        <Tab key="learning" title="📚 Learning">
          <Card className="bg-zinc-900 border border-zinc-800">
            <CardHeader>
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-blue-500" /> Agent Learning Log
              </h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {learning.map(log => {
                  const agent = AGENTS[log.agent as keyof typeof AGENTS];
                  return (
                    <div key={log.id} className={`p-4 rounded-lg border-l-4 ${getAgentColor(log.agent)}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-white">{agent?.name}</span>
                        <span className="text-gray-500 text-sm">{log.date}</span>
                      </div>
                      <p className="text-gray-300">"{log.lesson}"</p>
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>

      {/* Footer */}
      <footer className="mt-8 pt-6 border-t border-zinc-800 text-center text-gray-500 text-sm">
        <p>HANK Multi-Agent System v1.0 • Goal: $5,000/month • All agents operational</p>
      </footer>
    </div>
  );
}
