import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import AccessAlarmRoundedIcon from "@mui/icons-material/AccessAlarmRounded";
import Groups2RoundedIcon from "@mui/icons-material/Groups2Rounded";
import CommuteRoundedIcon from "@mui/icons-material/CommuteRounded";

export default function DashboardCards() {
  const stats = [
    {
      id: 1,
      name: "Polizze attive",
      stat: "250",
      icon: ArticleRoundedIcon,
    },
    {
      id: 2,
      name: "Polizze in scadenza (-10g)",
      stat: "50",
      icon: AccessAlarmRoundedIcon,
    },
    {
      id: 3,
      name: "Clienti registrati",
      stat: "70",
      icon: Groups2RoundedIcon,
    },
    {
      id: 4,
      name: "Veicoli registrati",
      stat: "300",
      icon: CommuteRoundedIcon,
    },
  ];
  return (
    <div>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.id}
            className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-primary p-3">
                <item.icon aria-hidden="true" className="h-6 w-6 text-white" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {item.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">
                {item.stat}
              </p>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
