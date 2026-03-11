import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import BarChartIcon from "@mui/icons-material/BarChart";
import MapIcon from "@mui/icons-material/Map";
import InfoIcon from "@mui/icons-material/Info";
import { useLocation, useNavigate } from "react-router-dom";

export default function NavigationTabs() {
	const location = useLocation();
	const navigate = useNavigate();

	const routes = ["/", "/map", "/charts"];

	const value = routes.indexOf(location.pathname);

	const handleChange = (event, newValue) => {
		navigate(routes[newValue]);
	};

	return (
		<BottomNavigation
			showLabels
			value={value}
			onChange={handleChange}
			sx={{
				position: "fixed",
				bottom: 0,
				left: 0,
				right: 0,
			}}
		>
			<BottomNavigationAction label="list" icon={<InfoIcon />} />
			<BottomNavigationAction label="map" icon={<MapIcon />} />
			<BottomNavigationAction label="charts" icon={<BarChartIcon />} />
		</BottomNavigation>
	);
}
