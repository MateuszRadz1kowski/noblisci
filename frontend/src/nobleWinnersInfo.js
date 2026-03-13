import {
	Button,
	Card,
	CardActions,
	CardContent,
	Typography,
	Drawer,
	Grid,
	Box,
	Divider,
	Chip,
	Link,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	Slider,
} from "@mui/material";

import { useEffect, useState } from "react";

export default function NobleWinnersInfo() {
	const [data, setData] = useState([]);
	const [open, setOpen] = useState(false);
	const [selectedLaureateId, setSelectedLaureateId] = useState(null);
	const [selectedLaureateData, setSelectedLaureateData] = useState(null);

	const [categoryFilter, setCategoryFilter] = useState("");
	const [yearMinFilter, setYearMinFilter] = useState(1900);
	const [yearMaxFilter, setYearMaxFilter] = useState(new Date().getFullYear());
	const [surnameFilter, setSurnameFilter] = useState("");

	const toggleDrawer = (newOpen, id) => () => {
		setOpen(newOpen);
		if (id) setSelectedLaureateId(id);
	};

	useEffect(() => {
		const getData = async () => {
			const response = await fetch(
				`/api/allLaureatesBaseInfo?category=${categoryFilter}&yearmin=${yearMinFilter}&yearmax=${yearMaxFilter}&surname=${surnameFilter}`,
			);

			const data = await response.json();
			console.log(data);
			setData(data);
		};

		getData();
	}, [categoryFilter, yearMinFilter, yearMaxFilter, surnameFilter]);

	useEffect(() => {
		if (!selectedLaureateId) return;

		const getData = async () => {
			const response = await fetch(
				`https://api.nobelprize.org/2.1/laureate/${selectedLaureateId}`,
			);

			const data = await response.json();

			setSelectedLaureateData(data[0]);
		};

		getData();
	}, [selectedLaureateId]);

	return (
		<Box
			sx={{
				minHeight: "100vh",
				background: "linear-gradient(135deg,#1e1e2f,#2e2a4a,#433c6e,#5e4ba3)",
				p: 4,
			}}
		>
			<Typography variant="h3" color="white" fontWeight="bold" mb={4}>
				Nobel Prize Laureates
			</Typography>

			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: "1fr 1fr 2fr",
					gap: 3,
					mb: 5,
					background: "#2e2a4a",
					p: 3,
					borderRadius: 3,
					boxShadow: 4,
				}}
			>
				<FormControl fullWidth>
					<InputLabel sx={{ color: "#c4b5fd" }}>Category</InputLabel>

					<Select
						value={categoryFilter}
						label="Category"
						onChange={(e) => setCategoryFilter(e.target.value)}
						sx={{
							background: "#433c6e",
							color: "white",
							borderRadius: 2,
						}}
					>
						<MenuItem value="">All</MenuItem>
						<MenuItem value={"Physics"}>Physics</MenuItem>
						<MenuItem value={"Chemistry"}>Chemistry</MenuItem>
						<MenuItem value={"Physiology or Medicine"}>
							Physiology or Medicine
						</MenuItem>
						<MenuItem value={"Literature"}>Literature</MenuItem>
						<MenuItem value={"Peace"}>Peace</MenuItem>
						<MenuItem value={"Economic Sciences"}>Economic Sciences</MenuItem>
					</Select>
				</FormControl>

				<TextField
					label="Surname"
					variant="outlined"
					onChange={(e) => setSurnameFilter(e.target.value)}
					sx={{
						background: "#433c6e",
						borderRadius: 2,
						input: { color: "white" },
						label: { color: "#c4b5fd" },
					}}
				/>

				<Box>
					<Typography color="white" mb={1}>
						Year range: {yearMinFilter} - {yearMaxFilter}
					</Typography>

					<Slider
						value={[yearMinFilter, yearMaxFilter]}
						onChangeCommitted={(e, newValue) => {
							setYearMinFilter(newValue[0]);
							setYearMaxFilter(newValue[1]);
						}}
						valueLabelDisplay="auto"
						min={1900}
						max={new Date().getFullYear()}
						sx={{ color: "#7c3aed" }}
					/>
				</Box>
			</Box>

			{/* CARDS */}

			<Grid container spacing={6}>
				{data?.map((person) => (
					<Grid item xs={12} sm={6} md={4} lg={3} key={person.id}>
						<Card
							sx={{
								height: "100%",
								borderRadius: 3,
								background: "#312e81",
								color: "white",
								boxShadow: 6,
								transition: "0.2s",
								"&:hover": { transform: "scale(1.03)" },
								padding: 2,
							}}
						>
							<CardContent>
								<Typography variant="h6" fontWeight="bold">
									{person.firstname} {person.surname}
								</Typography>

								<Box mt={1} mb={1}>
									<img
										src={`https://flagcdn.com/w40/${person?.bornCountryCode?.toLowerCase?.()}.png`}
										width={25}
										alt={person.bornCountry}
									/>
								</Box>

								<Typography variant="body2" mb={1}>
									{person?.bornCountry || "Unknown"}
								</Typography>

								<Typography variant="body2">
									{person?.prizes?.[0]?.year || "Unknown"} —{" "}
									{person?.prizes?.[0]?.category || "Unknown"}
								</Typography>

								<Typography variant="body2" sx={{ mt: 1 }}>
									{person?.prizes?.[0]?.motivation || "Unknown"}
								</Typography>
							</CardContent>

							<CardActions>
								<Button
									variant="contained"
									onClick={toggleDrawer(true, person.id)}
									sx={{ background: "#fff", color: "#312e81" }}
								>
									Learn More
								</Button>
							</CardActions>
						</Card>
					</Grid>
				))}
			</Grid>

			{/* DRAWER */}

			<Drawer open={open} onClose={toggleDrawer(false)} anchor="right">
				<Box
					sx={{
						width: 420,
						p: 4,
						background: "#433c6e",
						color: "white",
						height: "100%",
					}}
				>
					{selectedLaureateData ? (
						<>
							<Typography variant="h4" fontWeight="bold">
								{selectedLaureateData?.fullName?.en || "Unknown"}
							</Typography>

							<Chip
								label={selectedLaureateData?.gender || "Unknown"}
								sx={{
									mt: 1,
									background: "#7c3aed",
									color: "white",
								}}
							/>

							<Divider sx={{ my: 2, borderColor: "#a78bfa" }} />

							<Typography variant="h6">Birth</Typography>

							<Typography>
								Date: {selectedLaureateData?.birth?.date || "Unknown"}
							</Typography>

							<Typography>
								City:{" "}
								{selectedLaureateData?.birth?.place?.city?.en || "Unknown"}
							</Typography>

							<Typography>
								Country:{" "}
								{selectedLaureateData?.birth?.place?.countryNow?.en ||
									"Unknown"}
							</Typography>

							<Divider sx={{ my: 2, borderColor: "#a78bfa" }} />

							<Typography variant="h6">Death</Typography>

							<Typography>
								Date: {selectedLaureateData?.death?.date || "Unknown"}
							</Typography>

							<Typography>
								Place:{" "}
								{selectedLaureateData?.death?.place?.locationString?.en ||
									"Unknown"}
							</Typography>

							<Divider sx={{ my: 2, borderColor: "#a78bfa" }} />

							<Typography variant="h6">Nobel Prize</Typography>

							{selectedLaureateData?.nobelPrizes?.map((prize, i) => (
								<Box key={i} mb={2}>
									<Chip
										label={`${prize?.awardYear} ${prize?.category?.en}`}
										sx={{
											background: "#06b6d4",
											color: "white",
											mb: 1,
										}}
									/>

									<Typography>
										{prize?.categoryFullName?.en || "Unknown"}
									</Typography>

									<Typography variant="body2">
										Motivation: {prize?.motivation?.en || "Unknown"}
									</Typography>

									<Typography variant="body2">
										Prize amount: {prize?.prizeAmount || "Unknown"}
									</Typography>
								</Box>
							))}

							<Divider sx={{ my: 2, borderColor: "#a78bfa" }} />

							<Typography variant="h6">Links</Typography>

							<Box display="flex" flexDirection="column">
								<Link
									href={selectedLaureateData?.wikipedia?.english || "#"}
									target="_blank"
									color="#c4b5fd"
								>
									Wikipedia
								</Link>

								<Link
									href={selectedLaureateData?.links?.[1]?.href || "#"}
									target="_blank"
									color="#c4b5fd"
								>
									Nobel Prize Page
								</Link>
							</Box>
						</>
					) : (
						<Typography>Loading...</Typography>
					)}
				</Box>
			</Drawer>
		</Box>
	);
}
