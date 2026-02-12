import { useEffect, useState } from "react";
import { Thermometer, Droplet, Sun, Activity } from "lucide-react";
import Loading from "./Loading";
import Node3Control from "./Node3Control";

type ThingSpeakFeed = {
  field1: string | null;
  field2: string | null;
  field3: string | null;
  field4: string | null;
  created_at: string;
};

const Dashboard = () => {
  const [node1, setNode1] = useState<ThingSpeakFeed | null>(null);
  const [node2, setNode2] = useState<ThingSpeakFeed | null>(null);
  const [lastUpdated, setLastUpdated] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      if (!node1 && !node2) {
        setLoading(true);
      } else {
        setUpdating(true);
      }

      /* ================= NODE 1 ================= */
      const res1 = await fetch(
        "https://api.thingspeak.com/channels/3232296/feeds.json?api_key=1DF7VGBJUG072J8I&results=1"
      );
      const json1 = await res1.json();

      if (json1.feeds && json1.feeds.length > 0) {
        setNode1(json1.feeds[0]);
      }

      /* ================= NODE 2 ================= */
      const res2 = await fetch(
        "https://api.thingspeak.com/channels/3233683/feeds.json?results=1"
      );
      const json2 = await res2.json();

      if (json2.feeds && json2.feeds.length > 0) {
        setNode2(json2.feeds[0]);
        setLastUpdated(
          new Date(json2.feeds[0].created_at).toLocaleTimeString()
        );
      }

    } catch (error) {
      console.error("ThingSpeak Fetch Error:", error);
    } finally {
      setLoading(false);
      setUpdating(false);
    }
  };

  if (loading && !node1 && !node2) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center p-6">
      <div className="w-full max-w-2xl">

        <h1 className="text-2xl font-bold mb-6 text-center">
          🌱 Farm Monitoring Dashboard
        </h1>

        {updating && (
          <p className="text-center text-xs text-green-600 animate-pulse mb-4">
            🔄 Updating live data...
          </p>
        )}

        {/* ================= NODE 1 & NODE 2 ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Node 1 */}
          <div className="bg-white p-5 rounded-xl shadow-sm border">
            <h2 className="text-lg font-semibold mb-4 text-green-600 text-center">
              📡 Node 1
            </h2>

            <div className="space-y-4">
              <SensorRow icon={<Thermometer className="text-red-500 w-5 h-5" />} label="Temperature" value={node1?.field1} unit="°C" />
              <SensorRow icon={<Activity className="text-purple-500 w-5 h-5" />} label="pH Level" value={node1?.field2} />
              <SensorRow icon={<Droplet className="text-blue-500 w-5 h-5" />} label="Water Level" value={node1?.field3} />
              <SensorRow icon={<Sun className="text-yellow-500 w-5 h-5" />} label="LDR (Light)" value={node1?.field4} />
            </div>
          </div>

          {/* Node 2 */}
          <div className="bg-white p-5 rounded-xl shadow-sm border">
            <h2 className="text-lg font-semibold mb-4 text-blue-600 text-center">
              📡 Node 2
            </h2>

            <div className="space-y-4">
              <SensorRow icon={<Thermometer className="text-red-500 w-5 h-5" />} label="Temperature" value={node2?.field1} unit="°C" />
              <SensorRow icon={<Activity className="text-purple-500 w-5 h-5" />} label="pH Level" value={node2?.field2} />
              <SensorRow icon={<Droplet className="text-blue-500 w-5 h-5" />} label="Water Level" value={node2?.field3} />
              <SensorRow icon={<Sun className="text-yellow-500 w-5 h-5" />} label="LDR (Light)" value={node2?.field4} />
            </div>
          </div>

        </div>

        {/* ================= NODE 3 CONTROL ================= */}
        <div className="mt-8 max-w-md mx-auto">
          <Node3Control />
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          Last Updated: {lastUpdated || "Waiting for data..."}
        </p>

      </div>
    </div>
  );
};

/* ================= Sensor Row ================= */

const SensorRow = ({
  icon,
  label,
  value,
  unit = "",
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
  unit?: string;
}) => (
  <div className="flex items-center gap-4">
    {icon}
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-semibold">
        {value ?? "--"} {unit}
      </p>
    </div>
  </div>
);

export default Dashboard;
