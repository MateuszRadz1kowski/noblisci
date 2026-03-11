import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

export default function NobleWinnersInfo() {
	const [data, setData] = useState([]);

	useEffect(() => {
		const getData = async () => {
			const response = await fetch(`/api/allLaureatesBaseInfo`);
			const data = await response.json();
			console.log(data);
			setData(data);
		};
		getData();
	}, []);

	return (
		<div>
			{data &&
				data.map((data, index) => (
					<Card key={index}>
						<CardContent>
							{/* <CardMedia
							component="img"
							height="140"
							image="flaga"
							alt="flags"
						/> */}
							<Typography gutterBottom variant="h5" component="div">
								{data.firstname} {data.surname}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								{data.bornCountry}
								{/* <Image src={data.bornCountryFlag} alt={`${data.bornCountry} flag`} width={20} height={15} /> */}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								{data.prizes[0].year} - {data.prizes[0].category}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								{data.prizes[0].motivation}
							</Typography>
						</CardContent>
						<CardActions>
							<Button size="small">Learn More</Button>
						</CardActions>
					</Card>
					//dokladniejsze dane: call do https://api.nobelprize.org/2.1/laureate/456
				))}
		</div>
	);
}
