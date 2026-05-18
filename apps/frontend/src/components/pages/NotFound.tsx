import notFoundImage from "../../assets/404-not-found.svg";

export default function NotFound() {
	return (
		<div className="not-found-page">
			<img
				className="not-found-page__image"
				src={notFoundImage}
				alt="404 Not Found"
			/>
		</div>
	);
}