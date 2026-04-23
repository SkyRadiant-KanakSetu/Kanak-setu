import { useState } from "react";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import AiAdvisor from "./components/AiAdvisor";
import LiveCommandDeck from "./components/LiveCommandDeck";
import Research from "./components/Research";
import Opportunities from "./components/Opportunities";
import ListingBuilder from "./components/ListingBuilder";
import Marketing from "./components/Marketing";
import Revenue from "./components/Revenue";
import { useRealtimeMetrics } from "./lib/realtime";

const tabs = [
  { id: "research", label: "Research Engine" },
  { id: "opportunity", label: "Product Opportunity Explorer" },
  { id: "listing", label: "AI Listing Builder" },
  { id: "marketing", label: "Marketing Strategy Centre" },
  { id: "revenue", label: "Revenue Forecast" }
];

export default function App() {
  const [activeTab, setActiveTab] = useState("research");
  const live = useRealtimeMetrics();
  const [advisorMessages, setAdvisorMessages] = useState([
    {
      role: "assistant",
      content:
        "Sky Radiant India AI Advisor ready. Ask about sourcing, listings, PPC, retention, or margin optimization."
    }
  ]);

  const onSendToAdvisor = (content) => {
    setActiveTab("research");
    setAdvisorMessages((prev) => [...prev, { role: "user", content }]);
  };

  return (
    <div className="h-screen w-full bg-bg text-white">
      <div className="flex h-full">
        <Sidebar tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 overflow-y-auto">
          <TopBar live={live} />
          <div className="p-6">
            <LiveCommandDeck live={live} />
            {activeTab === "research" && <Research onSendToAdvisor={onSendToAdvisor} live={live} />}
            {activeTab === "opportunity" && <Opportunities onSendToAdvisor={onSendToAdvisor} live={live} />}
            {activeTab === "listing" && <ListingBuilder onSendToAdvisor={onSendToAdvisor} />}
            {activeTab === "marketing" && <Marketing onSendToAdvisor={onSendToAdvisor} live={live} />}
            {activeTab === "revenue" && <Revenue live={live} />}
          </div>
        </main>
        <AiAdvisor messages={advisorMessages} setMessages={setAdvisorMessages} />
      </div>
    </div>
  );
}
