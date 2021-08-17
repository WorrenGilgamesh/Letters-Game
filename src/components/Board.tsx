import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import dictionary from "./dictionary.json";
import testBoard1 from "./test-board-1.json";
import testBoard2 from "./test-board-2.json";

export const Board = () => {
	const test: string = ""; //<----Change test here test1,test2
	const [board, setBoard] = useState<
		Array<{ id: string; character: string; active: boolean }>
	>([]);

	const [wordObjects, setWordObjects] = useState<
		Array<{ id: string; character: string; active: boolean }>
	>([]);

	const [valid, setValid] = useState<boolean>(false);

	function random() {
		return Math.floor(Math.random() * (90 - 65 + 1) + 65);
	}

	useEffect(() => {
		if (test !== "test1" && test !== "test2") {
			setBoard(
				Array.from(Array(16)).map((e) => {
					return {
						id: uuidv4(),
						character: String.fromCharCode(random()),
						active: false,
					};
				})
			);
		} else if (test === "test1") {
			setBoard(
				testBoard1.board.map((piece) => {
					return {
						id: uuidv4(),
						character: piece,
						active: false,
					};
				})
			);
		} else if (test === "test2") {
			setBoard(
				testBoard2.board.map((piece) => {
					return {
						id: uuidv4(),
						character: piece,
						active: false,
					};
				})
			);
		}
	}, []);

	function handleClearWordClick() {
		setBoard(
			board.map((piece) =>
				piece.active === true ? { ...piece, active: false } : piece
			)
		);
		wordObjects.length = 0;
		setWordObjects(wordObjects);
		setValid(false);
	}

	function handleSelectWordClick(piece: {
		id: string;
		character: string;
		active: boolean;
	}) {
		const newWord = [...wordObjects, piece];
		if (wordObjects.length === 0) {
			// Color select
			setBoard(
				board.map((boardPiece) =>
					boardPiece.id === piece.id
						? { ...boardPiece, active: true }
						: boardPiece
				)
			);
			// Word char append
			setWordObjects(newWord);
		} else if (wordObjects.length < 6) {
			let neighborhoods = wordObjects.map((wordObject) => {
				let index: number = board.findIndex(
					(boardPiece) => boardPiece.id === wordObject.id
				);
				let neighbors: { id: string; character: string; active: boolean }[] =
					[];
				//no ceiling
				if (index > 3) neighbors.push(board[index - 4]); // push ceiling
				//no floor
				if (index < 12) neighbors.push(board[index + 4]); //push floor
				//no left
				if (index % 4 !== 0) neighbors.push(board[index - 1]); //push left
				//no right
				if ((index + 1) % 4 !== 0) neighbors.push(board[index + 1]); //push right
				//no up right diagonal
				if (index > 3 && index !== 7 && index !== 11 && index !== 15)
					neighbors.push(board[index - 3]); // up right diagonal
				//no up left diagonal
				if (index > 4 && index !== 8 && index !== 12)
					neighbors.push(board[index - 5]); //push up left diagonal
				//no down right diagonal
				if (index < 11 && index !== 7 && index !== 3)
					neighbors.push(board[index + 5]); //push down right diagonal
				//no down left diagonal
				if (index < 12 && index !== 8 && index !== 4 && index !== 0)
					neighbors.push(board[index + 3]); //push down left diagonal

				neighbors.push(board[index]);
				return neighbors;
			});
			if (
				neighborhoods.flat(1).some((boardPiece) => boardPiece.id === piece.id)
			) {
				setBoard(
					board.map((boardPiece) =>
						boardPiece.id === piece.id
							? { ...boardPiece, active: true }
							: boardPiece
					)
				);
				// Word char append
				setWordObjects(newWord);

				let compareWord = newWord
					.map((wordObjects) => wordObjects.character)
					.join("")
					.toLocaleLowerCase();
				let inDictionary = dictionary.words.some(
					(term) => term === compareWord
				);
				setValid(inDictionary);
			}
		}
	}

	return (
		<>
			<div className="table">
				<div className="board">
					{board.map((piece, i) => (
						<div
							className={`piece ${piece.active && valid ? "selected" : ""} ${
								piece.active && !valid ? "invalidSelected" : ""
							}`}
							key={piece.id}
							onClick={() => handleSelectWordClick(piece)}
						>
							{piece.character}
						</div>
					))}
				</div>

				<div className="reset">
					<p className="clearW">clear word</p>
					<button
						className="clearX"
						onClick={handleClearWordClick}
						disabled={wordObjects.length < 1}
					>
						x
					</button>
				</div>
				<div className={`wordBlock ${valid ? "valid" : "invalid"}`}>
					<p className={`word ${valid ? "valid" : "invalid"}`}>
						{wordObjects.map((wordObjects) => wordObjects.character).join("")}
					</p>
					<p
						hidden={wordObjects.length < 1}
						className={`wordValidation ${valid ? "valid" : "invalid"}`}
					>
						{valid ? "valid" : "invalid"}
					</p>
				</div>
			</div>
		</>
	);
};
