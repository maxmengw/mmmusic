import notFoundImage from "../../assets/not-found-rose.jpg";

export default function NotFound() {
	return (
		<div className="not-found-page">
			<img
				className="not-found-page__image"
				src={notFoundImage}
				alt="Not Found"
			/>
		</div>
	);
}