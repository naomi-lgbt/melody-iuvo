export const Html = `
<head>
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Comic%20Neue">
<style>
:root {
	--text: {text};
	--bg: {background};
}

body {
    width: 1300px;
	max-width: 1300px;
	height: 500px;
	max-height: 500px;
	background-color: var(--bg);
	font-family: "Comic Sans MS", "Chalkboard SE", "Comic Neue", "Comic Sans", cursive;
	margin: 0;
	padding: 0;
}

img {
    height: 500px;
	position: fixed;
	right: 0;
	top: 0;
	bottom: 0;
}

div {
	position: relative;
    border: 5px solid var(--text);
	width: calc(100% - 600px);
	margin-left: 50px;
	text-align: center;
	height: 400px;
	border-radius: 10px;
	font-size: {size}pt;
	display: grid;
}

p {
	margin: auto;
	color: var(--text);
	word-break: break-word;
	width: 100%;
	max-width: 100%
}

.point{
	width: 0;
	height: 0;
	border-left: 20px solid transparent;
	border-right: 20px solid transparent;
	border-bottom: 20px solid transparent;
	border-top: 100px solid var(--text);
	position: absolute;
	right: -80px;
	top: 250px;
	transform: rotate(-90deg);
}

span {
	position: fixed;
	bottom: 100px;
	left: 20px;
	font-size: 35px;
	color: var(--text);
}
</style>
</head>
<body>
<div class="bubble">
	<p>{message}</p>
    <div class="point"></div>
</div>
<img src="https://cdn.nhcarrigan.com/projects/naomi-says.png">
<span>Make your own! https://chat.naomi.lgbt</span>
</body>`;
