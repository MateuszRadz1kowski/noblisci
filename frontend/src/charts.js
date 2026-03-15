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
} from "recharts";

let data = [
	{
		name: "Page A",
		pv: 4000,
	},
	{
		name: "Page B",
		pv: 3000,
	},
	{
		name: "Page C",
		pv: 2000,
	},
];
export default function Charts() {
	const [dataBarChart, setDataBarChart] = useState([]);

	useEffect(() => {
		const getData = async () => {
			const response = await fetch(`/api/allLaureatesBaseInfo`);
			const data = await response.json();

			const categories = {};

			data.forEach((laureate) => {
				const category = laureate?.prizes?.[0]?.category;

				if (!category) return;

				if (!categories[category]) {
					categories[category] = 0;
				}

				categories[category]++;
			});
			const formatted = Object.entries(categories).map(([name, count]) => ({
				name,
				iloscLaureatow: count,
			}));
			setDataBarChart(formatted);
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
			</ResponsiveContainer>

			<LineChart
				style={{
					width: "100%",
					maxWidth: "700px",
					height: "100%",
					maxHeight: "70vh",
					aspectRatio: 1.618,
				}}
				responsive
				data={dataBarChart}
				margin={{
					top: 5,
					right: 0,
					left: 0,
					bottom: 5,
				}}
			>
				<CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-3)" />
				<XAxis dataKey="name" stroke="var(--color-text-3)" />
				<YAxis width="auto" stroke="var(--color-text-3)" />
				<Tooltip
					cursor={{
						stroke: "var(--color-border-2)",
					}}
					contentStyle={{
						backgroundColor: "var(--color-surface-raised)",
						borderColor: "var(--color-border-2)",
					}}
				/>
				<Legend />
				<Line
					type="monotone"
					dataKey="pv"
					stroke="var(--color-chart-1)"
					dot={{
						fill: "var(--color-surface-base)",
					}}
					activeDot={{ r: 8, stroke: "var(--color-surface-base)" }}
				/>
			</LineChart>
		</div>
	);
}
