import * as vscode from 'vscode';


 export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
	  vscode.commands.registerCommand('mypanel.start', async () => {
		// Create and show panel
		const panel = vscode.window.createWebviewPanel(
		  'mypanel',  // <--- identifier
		  'Stitch dashboard', // <--- title
		  vscode.ViewColumn.One,
		  {
			enableScripts: true
		  }
		);
  
		// And set its HTML content
		panel.webview.html = await getMyWebviewContent(panel.webview, context);   // <--- HTML

		panel.webview.onDidReceiveMessage(
			message => {
			  switch (message.command) {
				case 'alert':
				  vscode.window.showErrorMessage(message.text);
				  return;
			  }
			},
			undefined,
			context.subscriptions
		  );
	  })	
	);
  }
 


  async function  getMyWebviewContent (webview: vscode.Webview, context: any): Promise<string> { 
	let html: string = ``;
	
	const myStyle = webview.asWebviewUri(vscode.Uri.joinPath(
		  context.extensionUri, 'media', 'style.css'));   // <--- 'media' is the folder where the .css file is stored
	
	let rewardPriceInUsd = 0;
	const fetch = require('node-fetch');

	await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd').then((response: { json: () => any; }) =>
	{
		return response.json();
	}).then((data: { [x: string]: { [x: string]: number; }; }) => {
		rewardPriceInUsd = data['bitcoin']['usd'];
	});


	// construct your HTML code
	html += `
	<!DOCTYPE html>
	<html>
		<head>
		<link href="${myStyle}" rel="stylesheet" />
		</head>
		
		<body>
			<div class="main"> 
				<img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="300" />
				<h1>&nbsp &nbsp Code lines created:&nbsp;</h1>
				<h1 id="lines-of-code-counter">0</h1>

				<script>
					(function() {
						const vscode = acquireVsCodeApi();
						const counter = document.getElementById('lines-of-code-counter');

						const actionButton = document.getElementById('startAction');

						document.addEventListener('click', event => {
							vscode.postMessage({
								command: 'alert',
								text: 'New bugs found: 🐛🐛🐛!'
							});
							count = parseInt(count / 3);
						}, true);

						let count = 0;
						setInterval(() => {
							counter.textContent = count++;
						}, 300);
					}())
				</script>
			</div>

			<div class="main">
				<div>
				<button class="button-42" id="startAction">Refactor</button>
				</div>
			</div>

			
			<div class="main">
				<span id="lines-of-code-counter">` + rewardPriceInUsd+` </span>
			</div>
		</body>
	</html>
	`;
	
	
	// -----------------------
	return html;
  }