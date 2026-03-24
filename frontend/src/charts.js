import { useEffect, useState } from "react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	LineChart,
	Line,
	PieChart,
	Pie,
	Cell,
} from "recharts";

const COLORS = [
	"#6366f1",
	"#22c55e",
	"#f59e0b",
	"#ef4444",
	"#3b82f6",
	"#8b5cf6",
	"#10b981",
	"#f97316",
	"#ec4899",
	"#14b8a6",
];
export default function Charts() {
	const [dataBarChart, setDataBarChart] = useState([]);
	const [dataLineChart, setDataLineChart] = useState([]);
	const [dataPieChart, setDataPieChart] = useState([]);

	useEffect(() => {
		const getData = async () => {
			const response = await fetch(`/api/allLaureatesBaseInfo`);
			const data = await response.json();
			const responsePie = await fetch(`/api/stats/top-countries`);
			const pieData = await responsePie.json();
			setDataPieChart(pieData);
			const categories = {};

			const perYear = {};

			data.forEach((laureate) => {
				const year = laureate?.prizes?.[0]?.year;

				if (!year) return;

				if (!perYear[year]) {
					perYear[year] = 0;
				}

				perYear[year]++;
			});
			console.log(perYear);
			const formattedLineChart = Object.entries(perYear).map(
				([year, count]) => ({
					name: year,
					iloscLaureatow: count,
				}),
			);
			setDataLineChart(formattedLineChart);
			console.log(formattedLineChart);
			data.forEach((laureate) => {
				const category = laureate?.prizes?.[0]?.category;

				if (!category) return;

				if (!categories[category]) {
					categories[category] = 0;
				}

				categories[category]++;
			});
			const formattedBarChart = Object.entries(categories).map(
				([name, count]) => ({
					name,
					iloscLaureatow: count,
				}),
			);
			console.log(categories);
			setDataBarChart(formattedBarChart);
			console.log(formattedBarChart);
		};

		getData();
	}, []);

	return (
		<div style={{ width: "100%", maxWidth: 900, height: 400 }}>
			<ResponsiveContainer width="100%" height="100%">
				<BarChart
					data={dataBarChart}
					margin={{
						top: 20,
						right: 30,
						left: 10,
						bottom: 5,
					}}
				>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="name" />
					<YAxis />
					<Tooltip />
					<Legend />

					<Bar dataKey="iloscLaureatow" fill="#4f46e5" radius={[8, 8, 0, 0]} />
				</BarChart>
				<LineChart
					data={dataLineChart}
					margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
				>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="name" />
					<YAxis />
					<Tooltip />
					<Legend />

					<Line type="monotone" dataKey="iloscLaureatow" stroke="#6366f1" />
				</LineChart>

				<PieChart>
					<Tooltip />
					<Legend />

					<Pie
						data={dataPieChart}
						dataKey="iloscLaureatow"
						nameKey="country"
						cx="50%"
						cy="50%"
						outerRadius={120}
						label
					>
						{dataPieChart.map((entry, index) => (
							<Cell
								key={`cell-${index}`}
								fill={COLORS[index % COLORS.length]}
							/>
						))}
					</Pie>
				</PieChart>
			</ResponsiveContainer>
		</div>
	);
}
