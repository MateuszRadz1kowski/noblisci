import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import {
	Box,
	Typography,
	Divider,
	List,
	ListItem,
	Avatar,
} from "@mui/material";

export default function LeafletMap() {
	const [data, setData] = useState([]);
	const [countryObj, setCountryObj] = useState({});

	useEffect(() => {
		const getData = async () => {
			const response = await fetch(`/api/allLaureatesBaseInfo`);

			const data = await response.json();
			console.log(data);
			setData(data);
		};

		getData();
	}, []);

	useEffect(() => {
		if (data.length > 0) {
			createCountryStats();
		}
	}, [data]);

	const createCountryStats = async () => {
		const stats = {};

		for (const laureate of data) {
			const country = laureate.bornCountryCode;
			const category = laureate?.prizes?.[0]?.category;

			if (!country) continue;

			if (!stats[country]) {
				stats[country] = {
					numberOfLaureates: 0,
					categoriesNumber: {},
					laureates: [],
				};
			}

			stats[country].numberOfLaureates += 1;

			stats[country].laureates.push({
				id: laureate.id,
				firstname: laureate.firstname,
				surname: laureate.surname,
			});

			if (category) {
				stats[country].categoriesNumber[category] =
					(stats[country].categoriesNumber[category] || 0) + 1;
			}

			if (!stats[country].coordinates) {
				const response = await fetch(
					`https://restcountries.com/v3.1/alpha/${country}`,
				);
				const countryData = await response.json();

				stats[country].coordinates = countryData[0].latlng;
				stats[country].countryFlag = countryData[0].flags.png;
			}
		}

		setCountryObj(stats);
	};

	return (
		<div style={{ height: "90vh", width: "100%" }}>
			<MapContainer
				center={[52.2297, 21.0122]}
				zoom={6}
				style={{ height: "100%", width: "100%" }}
			>
				<TileLayer
					attribution="&copy; OpenStreetMap contributors"
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>

				{Object.entries(countryObj).map(([countryCode, info]) => {
					return (
						<Circle
							key={countryCode}
							center={info.coordinates}
							radius={info.numberOfLaureates * 5000}
							color="red"
						>
							<Popup minWidth={200} maxWidth={250}>
								<Box>
									<Typography
										variant="subtitle2"
										fontWeight="bold"
										gutterBottom
									>
										{countryCode} ({info.numberOfLaureates})
									</Typography>

									<Box mb={1}>
										<Avatar
											src={info.countryFlag}
											alt={`${countryCode} flag`}
											sx={{ width: 24, height: 16 }}
											variant="square"
										/>
									</Box>

									<Divider sx={{ my: 0.5 }} />

									<Typography variant="caption" fontWeight="bold">
										Categories:
									</Typography>
									<List dense sx={{ mb: 0.5 }}>
										{Object.entries(info.categoriesNumber).map(
											([cat, count]) => (
												<ListItem key={cat} sx={{ py: 0, px: 0 }}>
													<Typography variant="caption">
														{cat}: {count}
													</Typography>
												</ListItem>
											),
										)}
									</List>

									<Divider sx={{ my: 0.5 }} />

									<Typography variant="caption" fontWeight="bold" gutterBottom>
										Laureates:
									</Typography>
									<Box
										sx={{
											maxHeight: 100,
											overflowY: "auto",
										}}
									>
										<List dense>
											{info.laureates.map((l) => (
												<ListItem key={l.id} sx={{ py: 0.25, px: 0 }}>
													<Typography variant="caption">
														{l.firstname} {l.surname}
													</Typography>
												</ListItem>
											))}
										</List>
									</Box>
								</Box>
							</Popup>
						</Circle>
					);
				})}
			</MapContainer>
		</div>
	);
}
