(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))s(t);new MutationObserver(t=>{for(const l of t)if(l.type==="childList")for(const i of l.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function n(t){const l={};return t.integrity&&(l.integrity=t.integrity),t.referrerPolicy&&(l.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?l.credentials="include":t.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function s(t){if(t.ep)return;t.ep=!0;const l=n(t);fetch(t.href,l)}})();const Ye=`In this section we create a game called "Roll a Ball" based on the official Unity tutorial "https://learn.unity.com/project/roll-a-ball".\r
\r
![Game Environment](rollaball/1.png "Game Environment")\r
\r
The theme is "Telecom Paris master student." As the player, we control a ball and collect 12 courses, each worth 5 ECTS. After collecting a course, an hourglass appears near the ball and follows the player. Each hourglass lasts for 60 seconds. In total, the player has 365 seconds to collect all courses. There is also a health bar in the canteen that gives the player one extra chance to get hit by deadlines.\r
\r
![Gameplay](rollaball/gameplay.gif "Gameplay")\r
\r
Below are the implemented features.\r
\r
## 1. Ball Design\r
\r
The ball is an .stl model converted to .fbx in Blender. It has a light inside that increases in intensity as the ECTS value increases.\r
\r
![Ball light comparison](rollaball/2.png "Ball light comparison")\r
\r
## 2. Environment Design\r
\r
While the main design is implemented manually, most objects are free assets from the Unity Asset Store.\r
\r
## 3. Ball Movement\r
\r
The ball movement in this project is more advanced than in the tutorial. We can freely move the camera, we defined acceleration for smoother movement, and we added a jump mechanic. The code for this part is below.\r
\r
\`\`\`csharp\r
private void FixedUpdate()\r
{\r
    Vector3 movementDirection = Vector3.zero;\r
\r
    if (cameraTransform != null)\r
    {\r
        Vector3 camForward = cameraTransform.forward;\r
        Vector3 camRight = cameraTransform.right;\r
\r
        camForward.y = 0;\r
        camRight.y = 0;\r
        camForward.Normalize();\r
        camRight.Normalize();\r
\r
        movementDirection = (camForward * movementY + camRight * movementX).normalized;\r
    }\r
    else\r
    {\r
        movementDirection = new Vector3(movementX, 0.0f, movementY);\r
    }\r
\r
    rb.AddForce(movementDirection * acceleration, ForceMode.Acceleration);\r
\r
    Vector3 horizontalVelocity = new Vector3(rb.linearVelocity.x, 0f, rb.linearVelocity.z);\r
    if (horizontalVelocity.magnitude > maxSpeed)\r
    {\r
        Vector3 limited = horizontalVelocity.normalized * maxSpeed;\r
        rb.linearVelocity = new Vector3(limited.x, rb.linearVelocity.y, limited.z);\r
    }\r
}\r
\r
void OnJump(InputValue movementValue)\r
{\r
    // Specific check for ball shape.\r
    if (Physics.Raycast(transform.position, Vector3.down, GetComponent<Collider>().bounds.extents.y + 0.1f))\r
    {\r
        rb.AddForce(Vector3.up * jumpForce, ForceMode.Impulse);\r
    }\r
}\r
\`\`\`\r
\r
## 4. Player Health Bar\r
\r
The player health bar is a simple "hearts" UI on a Canvas. The player only has one health in the list at the start of the game. The health value is stored on the player in PlayerController as playerHealth. It is initialized in Start() and pushed to the UI via healthUI.SetHealth(playerHealth). When the player takes damage by colliding with an object tagged "Deadline," it decrements playerHealth, updates the hearts, and destroys that deadline object. When the player heals by entering a trigger tagged "Cantine," it increments playerHealth, updates the hearts, and destroys the pickup. The UI always shows the current integer health value.\r
\r
![Player Healthbar](rollaball/5.png "Player Healthbar")\r
\r
## 5. AI Movement\r
\r
The hourglass movement follows the tutorial. We define a NavMesh for the environment and assign the hourglasses as NavMesh agents to follow the player. Then we define collision with the player so that, on contact, the player loses a heart. We do this by defining a tag called "Deadline" and assigning it to the hourglasses:\r
\r
\`\`\`csharp\r
if (collision.gameObject.CompareTag("Deadline"))\r
{\r
    if (playerHealth <= 0)\r
    {\r
        LoseGame();\r
    }\r
    else\r
    {\r
        playerHealth -= 1;\r
        healthUI.SetHealth(playerHealth);\r
\r
        Destroy(collision.gameObject);\r
    }\r
}\r
\`\`\`\r
\r
![Nav Mesh](rollaball/6.png "Nav Mesh")\r
\r
\r
## 6. Deadlines Appearance and Perish\r
\r
![Enemy Spawn](rollaball/3.png "Enemy Spawn")\r
\r
When we collect a collectible (ECTS), we call ActivateEnemy() to activate or enable the hourglass. It already has a predefined location, so spawning only requires activating visibility.\r
\r
\`\`\`csharp\r
private void OnTriggerEnter(Collider other)\r
{\r
    if (other.CompareTag("Player"))\r
    {\r
        PlayerController player = other.GetComponentInParent<PlayerController>();\r
        if (player != null)\r
        {\r
            player.AddEcts(5);\r
        }\r
\r
        ActivateEnemy();\r
    }\r
}\r
\r
void ActivateEnemy()\r
{\r
    if (linkedEnemy != null)\r
    {\r
        if (linkedEnemy.transform.IsChildOf(transform))\r
        {\r
            linkedEnemy.transform.SetParent(null, true);\r
        }\r
\r
        linkedEnemy.SetActive(true);\r
    }\r
\r
    Destroy(gameObject);\r
}\r
\`\`\`\r
\r
For despawning, we define a 60-second lifetime after which they are destroyed.\r
\r
\`\`\`csharp\r
private IEnumerator DespawnAfterLifetime()\r
{\r
    yield return new WaitForSeconds(lifetimeSeconds);\r
\r
    if (despawnParticles != null)\r
    {\r
        despawnParticles.transform.SetParent(null, true);\r
        despawnParticles.Play();\r
        Destroy(despawnParticles.gameObject, despawnDelay);\r
    }\r
\r
    Destroy(gameObject);\r
}\r
\`\`\`\r
\r
## 7. Win Mechanism\r
\r
When the player triggers an ECTS collectible, it calls player.AddEcts(5) on PlayerController, which increments the private ECTS counter and updates the UI text. In PlayerController.cs, AddEcts checks if (ECTS >= 60) and, once that threshold is reached, it shows the graduation UI, pauses gameplay by setting Time.timeScale = 0f, and destroys a Deadline object via Destroy(GameObject.FindGameObjectWithTag("Deadline")).\r
\r
![Enemy Spawn](rollaball/4.png "Enemy Spawn")\r
`,et=`This part covers the tools and settings to build and run a Roll-a-Ball game on a Meta Quest headset. The goal is simple: get a working \`.apk\` running on the device before we touch gameplay code.\r
\r
# Installing the required apps\r
\r
## A) Meta Horizon app (mobile)\r
\r
Install Meta Horizon on your phone. Pair the phone with the headset and then enable Developer Mode.\r
\r
## B) Meta Quest Developer Hub (MQDH) (desktop)\r
\r
Install Meta Quest Developer Hub on your PC. Enable USB debugging so you can install/uninstall \`.apk\` builds quickly.\r
\r
Sign in with the same Meta account used on the headset. Then connect the headset via USB and accept the USB Debugging prompt inside the headset.\r
\r
# Turn on Developer Mode for the headset\r
\r
To build and run apps, the headset must be in Developer Mode. Create a Meta Developer account (Meta Developer Dashboard). In the Meta Horizon mobile app go to Menu → Devices → Developer Mode and toggle Developer Mode On.\r
\r
# Set up Android build support in Unity\r
\r
To build a Quest \`.apk\`, Unity must have Android modules installed.\r
\r
In Unity Hub, find the Unity version you are using and install Android Build Support, Android SDK & NDK Tools, and OpenJDK.\r
\r
# Unity project settings for Quest VR\r
\r
## A) Switch platform to Android (or Meta Quest)\r
\r
In the Unity project go to File → Build Settings and select Android (or Meta Quest), then click Switch Platform.\r
\r
## B) Set texture compression\r
\r
Set Texture Compression to ASTC (recommended for Quest).\r
\r
## C) Enable XR for Quest (OpenXR)\r
\r
Go to Edit → Project Settings → XR Plug-in Management. Under Android, enable OpenXR.\r
\r
Then go to Project Settings → XR Plug-in Management → OpenXR.\r
\r
Recommended settings:\r
- Enable Meta Quest support / Oculus profile (depends on Unity version).\r
- Stereo Rendering Mode: Multiview (good performance on Quest).\r
- Enable the relevant OpenXR interaction profiles (Meta/Oculus controller profile).\r
\r
If you use XR Interaction Toolkit, it typically expects OpenXR + the Input System.\r
\r
# Player settings (Android)\r
\r
Go to Edit → Project Settings → Player → Android.\r
\r
Recommended settings:\r
- Scripting Backend: IL2CPP\r
- Target Architectures: ARM64 (Quest requires 64-bit)\r
- Minimum API Level: choose a Quest-compatible Android version (use Unity/Meta recommendations)\r
- Active Input Handling: Input System Package (or Both if you still use the old input)\r
- Color Space: Linear (recommended for modern lighting; keep consistent with your pipeline)\r
- Graphics API: Vulkan (or OpenGLES3 depending on your project and render pipeline)\r
\r
Optional but useful:\r
- Package Name (e.g., \`com.yourname.rollaballvr\`)\r
- Company Name / Product Name\r
- App icon (makes it easier to find on the headset)\r
\r
# Add the correct scene(s) to Build Settings\r
\r
Even if the Scene view looks correct in the editor, the device build will show an empty world if your intended scene is not included in the build.\r
\r
Go to File → Build Settings.\r
\r
Make sure:\r
- Your VR scene (e.g., \`MiniGame.unity\`) is checked and listed.\r
- It is placed at the top if it should be the first scene loaded.\r
\r
This is one of the most common “works in editor, empty in headset” causes.\r
\r
# Build and run on the headset\r
\r
From Unity:\r
- Go to File → Build Settings.\r
- Ensure the headset is connected and recognized.\r
- Click Build And Run.\r
\r
If the app installs but you see a blank scene:\r
- Confirm the correct scene order in Build Settings.\r
- Confirm the scene contains an XR Origin / XR Rig and an XR-compatible camera setup.\r
- Check logs in MQDH (crashes or missing shaders show up quickly).\r
`,tt=`Content for Lecture 1: VR Fails will go here.\r
\r
`,nt=`Content for Final Project: Locomotion will go here.\r
\r
`,rt=`This section provides you quick tips about how this blog is created and deployed on github.\r
\r
\r
## 1. Requirements\r
\r
This blog is strongly inspired by "https://codepen.io/Vedant-Jain-the-bold/pen/dywQPLz".\r
\r
To build this blog, we selected a lightweight but powerful stack (we need node js for these):\r
\r
### **SCSS (Sass)**\r
We use **SCSS** for styling.\r
*   **Why?** The 3D environment in this blog is actually built using **CSS 3D Transforms**, not WebGL or Three.js! SCSS allows us to use variables and math functions to easily manage the complex \`transform\` and \`perspective\` properties. And also allows us to use cool projects from codepen.\r
\r
\r
### **Vite**\r
We use **Vite** as our build tool and development server. \r
*   **Why?** It is incredibly fast and bundles our assets efficiently to make sure the moving around this 3d environment is smooth.\r
\r
\r
### **JavaScript (ES Modules)**\r
We use vanilla **JavaScript**.\r
*   **Why?** Since we are manipulating DOM elements for the 3D effect, we don't need the overhead of a heavy framework like React or Angular. We use modern ES Modules to keep our code organized (e.g., separating \`camera.js\`, \`map.js\`, and \`data.js\`).\r
\r
### **Marked**\r
We use the **marked** library.\r
*   **Why?** This allows us to write blog posts in **Markdown** (like this one!) and have them automatically converted to HTML. This separates our content from our code.\r
\r
## 2. Development\r
\r
The core concept of this blog is a "CSS 3D Scroller".\r
\r
1.  **The Scene**: We create a \`div\` with \`perspective: 1000px\`.\r
2.  **The World**: We place a "world" container inside and move it along the Z-axis based on the user's scroll.\r
3.  **The Objects**: Posts are HTML elements positioned absolutely using \`transform: translate3d(...)\`.\r
\r
This approach gives us a 3D feeling while keeping the text selectable and the performance high on standard browsers.\r
\r
## 3. Deployment\r
\r
We use **GitHub Pages** for hosting.\r
\r
\r
*   **Process**: We use the \`gh-pages\` package. You can follow the instructions in image below to set it up.\r
\r
![Blog Setup 1](blog_setup/github.png)\r
\r
*   **Command**: Running "\`npm run deploy\`" builds the project (using Vite) into a \`dist\` folder and pushes that folder to a special branch on GitHub,.\r
`,st=`In this tutorial, we will walk through the process of setting up the Unity game engine and Visual Studio Code.\r
\r
## 1. Install Unity Hub\r
\r
First, download and install Unity Hub from the official Unity website. Unity Hub is the management tool for all your Unity projects and editor versions.\r
\r
   ![Unity Hub Installation Interface](unity_setup/1.png "Unity Hub Installation")\r
\r
## 2. Install Visual Studio Code\r
\r
We use Visual Studio Code as our code editor. Download it and ensure you install the "C# Dev Kit" or "C#" extension to enable IntelliSense and debugging features.\r
\r
   ![Visual Studio Code Setup](unity_setup/2.png "VS Code Setup")\r
\r
## 3. Create a New Project\r
\r
Open Unity Hub, navigate to the "Projects" tab, and click "New Project". Select the "3D Core" template to start with a clean 3D environment.\r
\r
   ![Creating a new 3D Project in Unity Hub](unity_setup/3.png "New Project Selection")\r
\r
## 4. Project Configuration\r
\r
Name your project (e.g., \`MR Locomotion\`) and choose a location on your drive. Click "Create Project" and wait for the Unity Editor to initialize.\r
\r
   ![Project Configuration and Initialization](unity_setup/4.png "Project Initialization")\r
\r
`;function H(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var T=H();function se(r){T=r}var P={exec:()=>null};function p(r,e=""){let n=typeof r=="string"?r:r.source,s={replace:(t,l)=>{let i=typeof l=="string"?l:l.source;return i=i.replace(m.caret,"$1"),n=n.replace(t,i),s},getRegex:()=>new RegExp(n,e)};return s}var ke=(()=>{try{return!!new RegExp("(?<=1)(?<!1)")}catch{return!1}})(),m={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceTabs:/^\t+/,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,unescapeTest:/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:r=>new RegExp(`^( {0,3}${r})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:r=>new RegExp(`^ {0,${Math.min(3,r-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:r=>new RegExp(`^ {0,${Math.min(3,r-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:r=>new RegExp(`^ {0,${Math.min(3,r-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:r=>new RegExp(`^ {0,${Math.min(3,r-1)}}#`),htmlBeginRegex:r=>new RegExp(`^ {0,${Math.min(3,r-1)}}<(?:[a-z].*>|!--)`,"i")},me=/^(?:[ \t]*(?:\n|$))+/,be=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,xe=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,z=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,we=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,q=/(?:[*+-]|\d{1,9}[.)])/,ie=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,le=p(ie).replace(/bull/g,q).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),ye=p(ie).replace(/bull/g,q).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),U=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,Se=/^[^\n]+/,Q=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,Te=p(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",Q).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),ve=p(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,q).getRegex(),D="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",V=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,Re=p("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",V).replace("tag",D).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),ae=p(U).replace("hr",z).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",D).getRegex(),$e=p(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",ae).getRegex(),W={blockquote:$e,code:be,def:Te,fences:xe,heading:we,hr:z,html:Re,lheading:le,list:ve,newline:me,paragraph:ae,table:P,text:Se},K=p("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",z).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",D).getRegex(),Ae={...W,lheading:ye,table:K,paragraph:p(U).replace("hr",z).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",K).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",D).getRegex()},Pe={...W,html:p(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",V).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:P,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:p(U).replace("hr",z).replace("heading",` *#{1,6} *[^
]`).replace("lheading",le).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},ze=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,Ce=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,oe=/^( {2,}|\\)\n(?!\s*$)/,Ie=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,M=/[\p{P}\p{S}]/u,G=/[\s\p{P}\p{S}]/u,ce=/[^\s\p{P}\p{S}]/u,_e=p(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,G).getRegex(),he=/(?!~)[\p{P}\p{S}]/u,Ee=/(?!~)[\s\p{P}\p{S}]/u,De=/(?:[^\s\p{P}\p{S}]|~)/u,Me=p(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",ke?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),pe=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,Be=p(pe,"u").replace(/punct/g,M).getRegex(),Le=p(pe,"u").replace(/punct/g,he).getRegex(),ue="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",je=p(ue,"gu").replace(/notPunctSpace/g,ce).replace(/punctSpace/g,G).replace(/punct/g,M).getRegex(),Oe=p(ue,"gu").replace(/notPunctSpace/g,De).replace(/punctSpace/g,Ee).replace(/punct/g,he).getRegex(),He=p("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,ce).replace(/punctSpace/g,G).replace(/punct/g,M).getRegex(),qe=p(/\\(punct)/,"gu").replace(/punct/g,M).getRegex(),Ue=p(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Qe=p(V).replace("(?:-->|$)","-->").getRegex(),Ve=p("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Qe).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),I=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/,We=p(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label",I).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),de=p(/^!?\[(label)\]\[(ref)\]/).replace("label",I).replace("ref",Q).getRegex(),ge=p(/^!?\[(ref)\](?:\[\])?/).replace("ref",Q).getRegex(),Ge=p("reflink|nolink(?!\\()","g").replace("reflink",de).replace("nolink",ge).getRegex(),Y=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,N={_backpedal:P,anyPunctuation:qe,autolink:Ue,blockSkip:Me,br:oe,code:Ce,del:P,emStrongLDelim:Be,emStrongRDelimAst:je,emStrongRDelimUnd:He,escape:ze,link:We,nolink:ge,punctuation:_e,reflink:de,reflinkSearch:Ge,tag:Ve,text:Ie,url:P},Ne={...N,link:p(/^!?\[(label)\]\((.*?)\)/).replace("label",I).getRegex(),reflink:p(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",I).getRegex()},L={...N,emStrongRDelimAst:Oe,emStrongLDelim:Le,url:p(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol",Y).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:p(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol",Y).getRegex()},Fe={...L,br:p(oe).replace("{2,}","*").getRegex(),text:p(L.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},C={normal:W,gfm:Ae,pedantic:Pe},R={normal:N,gfm:L,breaks:Fe,pedantic:Ne},Ze={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},ee=r=>Ze[r];function y(r,e){if(e){if(m.escapeTest.test(r))return r.replace(m.escapeReplace,ee)}else if(m.escapeTestNoEncode.test(r))return r.replace(m.escapeReplaceNoEncode,ee);return r}function te(r){try{r=encodeURI(r).replace(m.percentDecode,"%")}catch{return null}return r}function ne(r,e){let n=r.replace(m.findPipe,(l,i,o)=>{let a=!1,h=i;for(;--h>=0&&o[h]==="\\";)a=!a;return a?"|":" |"}),s=n.split(m.splitPipe),t=0;if(s[0].trim()||s.shift(),s.length>0&&!s.at(-1)?.trim()&&s.pop(),e)if(s.length>e)s.splice(e);else for(;s.length<e;)s.push("");for(;t<s.length;t++)s[t]=s[t].trim().replace(m.slashPipe,"|");return s}function $(r,e,n){let s=r.length;if(s===0)return"";let t=0;for(;t<s&&r.charAt(s-t-1)===e;)t++;return r.slice(0,s-t)}function Xe(r,e){if(r.indexOf(e[1])===-1)return-1;let n=0;for(let s=0;s<r.length;s++)if(r[s]==="\\")s++;else if(r[s]===e[0])n++;else if(r[s]===e[1]&&(n--,n<0))return s;return n>0?-2:-1}function re(r,e,n,s,t){let l=e.href,i=e.title||null,o=r[1].replace(t.other.outputLinkReplace,"$1");s.state.inLink=!0;let a={type:r[0].charAt(0)==="!"?"image":"link",raw:n,href:l,title:i,text:o,tokens:s.inlineTokens(o)};return s.state.inLink=!1,a}function Je(r,e,n){let s=r.match(n.other.indentCodeCompensation);if(s===null)return e;let t=s[1];return e.split(`
`).map(l=>{let i=l.match(n.other.beginningSpace);if(i===null)return l;let[o]=i;return o.length>=t.length?l.slice(t.length):l}).join(`
`)}var _=class{options;rules;lexer;constructor(r){this.options=r||T}space(r){let e=this.rules.block.newline.exec(r);if(e&&e[0].length>0)return{type:"space",raw:e[0]}}code(r){let e=this.rules.block.code.exec(r);if(e){let n=e[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:e[0],codeBlockStyle:"indented",text:this.options.pedantic?n:$(n,`
`)}}}fences(r){let e=this.rules.block.fences.exec(r);if(e){let n=e[0],s=Je(n,e[3]||"",this.rules);return{type:"code",raw:n,lang:e[2]?e[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):e[2],text:s}}}heading(r){let e=this.rules.block.heading.exec(r);if(e){let n=e[2].trim();if(this.rules.other.endingHash.test(n)){let s=$(n,"#");(this.options.pedantic||!s||this.rules.other.endingSpaceChar.test(s))&&(n=s.trim())}return{type:"heading",raw:e[0],depth:e[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(r){let e=this.rules.block.hr.exec(r);if(e)return{type:"hr",raw:$(e[0],`
`)}}blockquote(r){let e=this.rules.block.blockquote.exec(r);if(e){let n=$(e[0],`
`).split(`
`),s="",t="",l=[];for(;n.length>0;){let i=!1,o=[],a;for(a=0;a<n.length;a++)if(this.rules.other.blockquoteStart.test(n[a]))o.push(n[a]),i=!0;else if(!i)o.push(n[a]);else break;n=n.slice(a);let h=o.join(`
`),c=h.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");s=s?`${s}
${h}`:h,t=t?`${t}
${c}`:c;let g=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(c,l,!0),this.lexer.state.top=g,n.length===0)break;let u=l.at(-1);if(u?.type==="code")break;if(u?.type==="blockquote"){let k=u,f=k.raw+`
`+n.join(`
`),b=this.blockquote(f);l[l.length-1]=b,s=s.substring(0,s.length-k.raw.length)+b.raw,t=t.substring(0,t.length-k.text.length)+b.text;break}else if(u?.type==="list"){let k=u,f=k.raw+`
`+n.join(`
`),b=this.list(f);l[l.length-1]=b,s=s.substring(0,s.length-u.raw.length)+b.raw,t=t.substring(0,t.length-k.raw.length)+b.raw,n=f.substring(l.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:s,tokens:l,text:t}}}list(r){let e=this.rules.block.list.exec(r);if(e){let n=e[1].trim(),s=n.length>1,t={type:"list",raw:"",ordered:s,start:s?+n.slice(0,-1):"",loose:!1,items:[]};n=s?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=s?n:"[*+-]");let l=this.rules.other.listItemRegex(n),i=!1;for(;r;){let a=!1,h="",c="";if(!(e=l.exec(r))||this.rules.block.hr.test(r))break;h=e[0],r=r.substring(h.length);let g=e[2].split(`
`,1)[0].replace(this.rules.other.listReplaceTabs,b=>" ".repeat(3*b.length)),u=r.split(`
`,1)[0],k=!g.trim(),f=0;if(this.options.pedantic?(f=2,c=g.trimStart()):k?f=e[1].length+1:(f=e[2].search(this.rules.other.nonSpaceChar),f=f>4?1:f,c=g.slice(f),f+=e[1].length),k&&this.rules.other.blankLine.test(u)&&(h+=u+`
`,r=r.substring(u.length+1),a=!0),!a){let b=this.rules.other.nextBulletRegex(f),Z=this.rules.other.hrRegex(f),X=this.rules.other.fencesBeginRegex(f),J=this.rules.other.headingBeginRegex(f),fe=this.rules.other.htmlBeginRegex(f);for(;r;){let B=r.split(`
`,1)[0],v;if(u=B,this.options.pedantic?(u=u.replace(this.rules.other.listReplaceNesting,"  "),v=u):v=u.replace(this.rules.other.tabCharGlobal,"    "),X.test(u)||J.test(u)||fe.test(u)||b.test(u)||Z.test(u))break;if(v.search(this.rules.other.nonSpaceChar)>=f||!u.trim())c+=`
`+v.slice(f);else{if(k||g.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||X.test(g)||J.test(g)||Z.test(g))break;c+=`
`+u}!k&&!u.trim()&&(k=!0),h+=B+`
`,r=r.substring(B.length+1),g=v.slice(f)}}t.loose||(i?t.loose=!0:this.rules.other.doubleBlankLine.test(h)&&(i=!0)),t.items.push({type:"list_item",raw:h,task:!!this.options.gfm&&this.rules.other.listIsTask.test(c),loose:!1,text:c,tokens:[]}),t.raw+=h}let o=t.items.at(-1);if(o)o.raw=o.raw.trimEnd(),o.text=o.text.trimEnd();else return;t.raw=t.raw.trimEnd();for(let a of t.items){if(this.lexer.state.top=!1,a.tokens=this.lexer.blockTokens(a.text,[]),a.task){if(a.text=a.text.replace(this.rules.other.listReplaceTask,""),a.tokens[0]?.type==="text"||a.tokens[0]?.type==="paragraph"){a.tokens[0].raw=a.tokens[0].raw.replace(this.rules.other.listReplaceTask,""),a.tokens[0].text=a.tokens[0].text.replace(this.rules.other.listReplaceTask,"");for(let c=this.lexer.inlineQueue.length-1;c>=0;c--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[c].src)){this.lexer.inlineQueue[c].src=this.lexer.inlineQueue[c].src.replace(this.rules.other.listReplaceTask,"");break}}let h=this.rules.other.listTaskCheckbox.exec(a.raw);if(h){let c={type:"checkbox",raw:h[0]+" ",checked:h[0]!=="[ ]"};a.checked=c.checked,t.loose?a.tokens[0]&&["paragraph","text"].includes(a.tokens[0].type)&&"tokens"in a.tokens[0]&&a.tokens[0].tokens?(a.tokens[0].raw=c.raw+a.tokens[0].raw,a.tokens[0].text=c.raw+a.tokens[0].text,a.tokens[0].tokens.unshift(c)):a.tokens.unshift({type:"paragraph",raw:c.raw,text:c.raw,tokens:[c]}):a.tokens.unshift(c)}}if(!t.loose){let h=a.tokens.filter(g=>g.type==="space"),c=h.length>0&&h.some(g=>this.rules.other.anyLine.test(g.raw));t.loose=c}}if(t.loose)for(let a of t.items){a.loose=!0;for(let h of a.tokens)h.type==="text"&&(h.type="paragraph")}return t}}html(r){let e=this.rules.block.html.exec(r);if(e)return{type:"html",block:!0,raw:e[0],pre:e[1]==="pre"||e[1]==="script"||e[1]==="style",text:e[0]}}def(r){let e=this.rules.block.def.exec(r);if(e){let n=e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),s=e[2]?e[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",t=e[3]?e[3].substring(1,e[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):e[3];return{type:"def",tag:n,raw:e[0],href:s,title:t}}}table(r){let e=this.rules.block.table.exec(r);if(!e||!this.rules.other.tableDelimiter.test(e[2]))return;let n=ne(e[1]),s=e[2].replace(this.rules.other.tableAlignChars,"").split("|"),t=e[3]?.trim()?e[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],l={type:"table",raw:e[0],header:[],align:[],rows:[]};if(n.length===s.length){for(let i of s)this.rules.other.tableAlignRight.test(i)?l.align.push("right"):this.rules.other.tableAlignCenter.test(i)?l.align.push("center"):this.rules.other.tableAlignLeft.test(i)?l.align.push("left"):l.align.push(null);for(let i=0;i<n.length;i++)l.header.push({text:n[i],tokens:this.lexer.inline(n[i]),header:!0,align:l.align[i]});for(let i of t)l.rows.push(ne(i,l.header.length).map((o,a)=>({text:o,tokens:this.lexer.inline(o),header:!1,align:l.align[a]})));return l}}lheading(r){let e=this.rules.block.lheading.exec(r);if(e)return{type:"heading",raw:e[0],depth:e[2].charAt(0)==="="?1:2,text:e[1],tokens:this.lexer.inline(e[1])}}paragraph(r){let e=this.rules.block.paragraph.exec(r);if(e){let n=e[1].charAt(e[1].length-1)===`
`?e[1].slice(0,-1):e[1];return{type:"paragraph",raw:e[0],text:n,tokens:this.lexer.inline(n)}}}text(r){let e=this.rules.block.text.exec(r);if(e)return{type:"text",raw:e[0],text:e[0],tokens:this.lexer.inline(e[0])}}escape(r){let e=this.rules.inline.escape.exec(r);if(e)return{type:"escape",raw:e[0],text:e[1]}}tag(r){let e=this.rules.inline.tag.exec(r);if(e)return!this.lexer.state.inLink&&this.rules.other.startATag.test(e[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(e[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(e[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(e[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:e[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:e[0]}}link(r){let e=this.rules.inline.link.exec(r);if(e){let n=e[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;let l=$(n.slice(0,-1),"\\");if((n.length-l.length)%2===0)return}else{let l=Xe(e[2],"()");if(l===-2)return;if(l>-1){let i=(e[0].indexOf("!")===0?5:4)+e[1].length+l;e[2]=e[2].substring(0,l),e[0]=e[0].substring(0,i).trim(),e[3]=""}}let s=e[2],t="";if(this.options.pedantic){let l=this.rules.other.pedanticHrefTitle.exec(s);l&&(s=l[1],t=l[3])}else t=e[3]?e[3].slice(1,-1):"";return s=s.trim(),this.rules.other.startAngleBracket.test(s)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?s=s.slice(1):s=s.slice(1,-1)),re(e,{href:s&&s.replace(this.rules.inline.anyPunctuation,"$1"),title:t&&t.replace(this.rules.inline.anyPunctuation,"$1")},e[0],this.lexer,this.rules)}}reflink(r,e){let n;if((n=this.rules.inline.reflink.exec(r))||(n=this.rules.inline.nolink.exec(r))){let s=(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal," "),t=e[s.toLowerCase()];if(!t){let l=n[0].charAt(0);return{type:"text",raw:l,text:l}}return re(n,t,n[0],this.lexer,this.rules)}}emStrong(r,e,n=""){let s=this.rules.inline.emStrongLDelim.exec(r);if(!(!s||s[3]&&n.match(this.rules.other.unicodeAlphaNumeric))&&(!(s[1]||s[2])||!n||this.rules.inline.punctuation.exec(n))){let t=[...s[0]].length-1,l,i,o=t,a=0,h=s[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(h.lastIndex=0,e=e.slice(-1*r.length+t);(s=h.exec(e))!=null;){if(l=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!l)continue;if(i=[...l].length,s[3]||s[4]){o+=i;continue}else if((s[5]||s[6])&&t%3&&!((t+i)%3)){a+=i;continue}if(o-=i,o>0)continue;i=Math.min(i,i+o+a);let c=[...s[0]][0].length,g=r.slice(0,t+s.index+c+i);if(Math.min(t,i)%2){let k=g.slice(1,-1);return{type:"em",raw:g,text:k,tokens:this.lexer.inlineTokens(k)}}let u=g.slice(2,-2);return{type:"strong",raw:g,text:u,tokens:this.lexer.inlineTokens(u)}}}}codespan(r){let e=this.rules.inline.code.exec(r);if(e){let n=e[2].replace(this.rules.other.newLineCharGlobal," "),s=this.rules.other.nonSpaceChar.test(n),t=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return s&&t&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:e[0],text:n}}}br(r){let e=this.rules.inline.br.exec(r);if(e)return{type:"br",raw:e[0]}}del(r){let e=this.rules.inline.del.exec(r);if(e)return{type:"del",raw:e[0],text:e[2],tokens:this.lexer.inlineTokens(e[2])}}autolink(r){let e=this.rules.inline.autolink.exec(r);if(e){let n,s;return e[2]==="@"?(n=e[1],s="mailto:"+n):(n=e[1],s=n),{type:"link",raw:e[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}url(r){let e;if(e=this.rules.inline.url.exec(r)){let n,s;if(e[2]==="@")n=e[0],s="mailto:"+n;else{let t;do t=e[0],e[0]=this.rules.inline._backpedal.exec(e[0])?.[0]??"";while(t!==e[0]);n=e[0],e[1]==="www."?s="http://"+e[0]:s=e[0]}return{type:"link",raw:e[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(r){let e=this.rules.inline.text.exec(r);if(e){let n=this.lexer.state.inRawBlock;return{type:"text",raw:e[0],text:e[0],escaped:n}}}},x=class j{tokens;options;state;inlineQueue;tokenizer;constructor(e){this.tokens=[],this.tokens.links=Object.create(null),this.options=e||T,this.options.tokenizer=this.options.tokenizer||new _,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let n={other:m,block:C.normal,inline:R.normal};this.options.pedantic?(n.block=C.pedantic,n.inline=R.pedantic):this.options.gfm&&(n.block=C.gfm,this.options.breaks?n.inline=R.breaks:n.inline=R.gfm),this.tokenizer.rules=n}static get rules(){return{block:C,inline:R}}static lex(e,n){return new j(n).lex(e)}static lexInline(e,n){return new j(n).inlineTokens(e)}lex(e){e=e.replace(m.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let n=0;n<this.inlineQueue.length;n++){let s=this.inlineQueue[n];this.inlineTokens(s.src,s.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,n=[],s=!1){for(this.options.pedantic&&(e=e.replace(m.tabCharGlobal,"    ").replace(m.spaceLine,""));e;){let t;if(this.options.extensions?.block?.some(i=>(t=i.call({lexer:this},e,n))?(e=e.substring(t.raw.length),n.push(t),!0):!1))continue;if(t=this.tokenizer.space(e)){e=e.substring(t.raw.length);let i=n.at(-1);t.raw.length===1&&i!==void 0?i.raw+=`
`:n.push(t);continue}if(t=this.tokenizer.code(e)){e=e.substring(t.raw.length);let i=n.at(-1);i?.type==="paragraph"||i?.type==="text"?(i.raw+=(i.raw.endsWith(`
`)?"":`
`)+t.raw,i.text+=`
`+t.text,this.inlineQueue.at(-1).src=i.text):n.push(t);continue}if(t=this.tokenizer.fences(e)){e=e.substring(t.raw.length),n.push(t);continue}if(t=this.tokenizer.heading(e)){e=e.substring(t.raw.length),n.push(t);continue}if(t=this.tokenizer.hr(e)){e=e.substring(t.raw.length),n.push(t);continue}if(t=this.tokenizer.blockquote(e)){e=e.substring(t.raw.length),n.push(t);continue}if(t=this.tokenizer.list(e)){e=e.substring(t.raw.length),n.push(t);continue}if(t=this.tokenizer.html(e)){e=e.substring(t.raw.length),n.push(t);continue}if(t=this.tokenizer.def(e)){e=e.substring(t.raw.length);let i=n.at(-1);i?.type==="paragraph"||i?.type==="text"?(i.raw+=(i.raw.endsWith(`
`)?"":`
`)+t.raw,i.text+=`
`+t.raw,this.inlineQueue.at(-1).src=i.text):this.tokens.links[t.tag]||(this.tokens.links[t.tag]={href:t.href,title:t.title},n.push(t));continue}if(t=this.tokenizer.table(e)){e=e.substring(t.raw.length),n.push(t);continue}if(t=this.tokenizer.lheading(e)){e=e.substring(t.raw.length),n.push(t);continue}let l=e;if(this.options.extensions?.startBlock){let i=1/0,o=e.slice(1),a;this.options.extensions.startBlock.forEach(h=>{a=h.call({lexer:this},o),typeof a=="number"&&a>=0&&(i=Math.min(i,a))}),i<1/0&&i>=0&&(l=e.substring(0,i+1))}if(this.state.top&&(t=this.tokenizer.paragraph(l))){let i=n.at(-1);s&&i?.type==="paragraph"?(i.raw+=(i.raw.endsWith(`
`)?"":`
`)+t.raw,i.text+=`
`+t.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=i.text):n.push(t),s=l.length!==e.length,e=e.substring(t.raw.length);continue}if(t=this.tokenizer.text(e)){e=e.substring(t.raw.length);let i=n.at(-1);i?.type==="text"?(i.raw+=(i.raw.endsWith(`
`)?"":`
`)+t.raw,i.text+=`
`+t.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=i.text):n.push(t);continue}if(e){let i="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(i);break}else throw new Error(i)}}return this.state.top=!0,n}inline(e,n=[]){return this.inlineQueue.push({src:e,tokens:n}),n}inlineTokens(e,n=[]){let s=e,t=null;if(this.tokens.links){let a=Object.keys(this.tokens.links);if(a.length>0)for(;(t=this.tokenizer.rules.inline.reflinkSearch.exec(s))!=null;)a.includes(t[0].slice(t[0].lastIndexOf("[")+1,-1))&&(s=s.slice(0,t.index)+"["+"a".repeat(t[0].length-2)+"]"+s.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(t=this.tokenizer.rules.inline.anyPunctuation.exec(s))!=null;)s=s.slice(0,t.index)+"++"+s.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let l;for(;(t=this.tokenizer.rules.inline.blockSkip.exec(s))!=null;)l=t[2]?t[2].length:0,s=s.slice(0,t.index+l)+"["+"a".repeat(t[0].length-l-2)+"]"+s.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);s=this.options.hooks?.emStrongMask?.call({lexer:this},s)??s;let i=!1,o="";for(;e;){i||(o=""),i=!1;let a;if(this.options.extensions?.inline?.some(c=>(a=c.call({lexer:this},e,n))?(e=e.substring(a.raw.length),n.push(a),!0):!1))continue;if(a=this.tokenizer.escape(e)){e=e.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.tag(e)){e=e.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.link(e)){e=e.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(a.raw.length);let c=n.at(-1);a.type==="text"&&c?.type==="text"?(c.raw+=a.raw,c.text+=a.text):n.push(a);continue}if(a=this.tokenizer.emStrong(e,s,o)){e=e.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.codespan(e)){e=e.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.br(e)){e=e.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.del(e)){e=e.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.autolink(e)){e=e.substring(a.raw.length),n.push(a);continue}if(!this.state.inLink&&(a=this.tokenizer.url(e))){e=e.substring(a.raw.length),n.push(a);continue}let h=e;if(this.options.extensions?.startInline){let c=1/0,g=e.slice(1),u;this.options.extensions.startInline.forEach(k=>{u=k.call({lexer:this},g),typeof u=="number"&&u>=0&&(c=Math.min(c,u))}),c<1/0&&c>=0&&(h=e.substring(0,c+1))}if(a=this.tokenizer.inlineText(h)){e=e.substring(a.raw.length),a.raw.slice(-1)!=="_"&&(o=a.raw.slice(-1)),i=!0;let c=n.at(-1);c?.type==="text"?(c.raw+=a.raw,c.text+=a.text):n.push(a);continue}if(e){let c="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(c);break}else throw new Error(c)}}return n}},E=class{options;parser;constructor(r){this.options=r||T}space(r){return""}code({text:r,lang:e,escaped:n}){let s=(e||"").match(m.notSpaceStart)?.[0],t=r.replace(m.endingNewline,"")+`
`;return s?'<pre><code class="language-'+y(s)+'">'+(n?t:y(t,!0))+`</code></pre>
`:"<pre><code>"+(n?t:y(t,!0))+`</code></pre>
`}blockquote({tokens:r}){return`<blockquote>
${this.parser.parse(r)}</blockquote>
`}html({text:r}){return r}def(r){return""}heading({tokens:r,depth:e}){return`<h${e}>${this.parser.parseInline(r)}</h${e}>
`}hr(r){return`<hr>
`}list(r){let e=r.ordered,n=r.start,s="";for(let i=0;i<r.items.length;i++){let o=r.items[i];s+=this.listitem(o)}let t=e?"ol":"ul",l=e&&n!==1?' start="'+n+'"':"";return"<"+t+l+`>
`+s+"</"+t+`>
`}listitem(r){return`<li>${this.parser.parse(r.tokens)}</li>
`}checkbox({checked:r}){return"<input "+(r?'checked="" ':"")+'disabled="" type="checkbox"> '}paragraph({tokens:r}){return`<p>${this.parser.parseInline(r)}</p>
`}table(r){let e="",n="";for(let t=0;t<r.header.length;t++)n+=this.tablecell(r.header[t]);e+=this.tablerow({text:n});let s="";for(let t=0;t<r.rows.length;t++){let l=r.rows[t];n="";for(let i=0;i<l.length;i++)n+=this.tablecell(l[i]);s+=this.tablerow({text:n})}return s&&(s=`<tbody>${s}</tbody>`),`<table>
<thead>
`+e+`</thead>
`+s+`</table>
`}tablerow({text:r}){return`<tr>
${r}</tr>
`}tablecell(r){let e=this.parser.parseInline(r.tokens),n=r.header?"th":"td";return(r.align?`<${n} align="${r.align}">`:`<${n}>`)+e+`</${n}>
`}strong({tokens:r}){return`<strong>${this.parser.parseInline(r)}</strong>`}em({tokens:r}){return`<em>${this.parser.parseInline(r)}</em>`}codespan({text:r}){return`<code>${y(r,!0)}</code>`}br(r){return"<br>"}del({tokens:r}){return`<del>${this.parser.parseInline(r)}</del>`}link({href:r,title:e,tokens:n}){let s=this.parser.parseInline(n),t=te(r);if(t===null)return s;r=t;let l='<a href="'+r+'"';return e&&(l+=' title="'+y(e)+'"'),l+=">"+s+"</a>",l}image({href:r,title:e,text:n,tokens:s}){s&&(n=this.parser.parseInline(s,this.parser.textRenderer));let t=te(r);if(t===null)return y(n);r=t;let l=`<img src="${r}" alt="${n}"`;return e&&(l+=` title="${y(e)}"`),l+=">",l}text(r){return"tokens"in r&&r.tokens?this.parser.parseInline(r.tokens):"escaped"in r&&r.escaped?r.text:y(r.text)}},F=class{strong({text:r}){return r}em({text:r}){return r}codespan({text:r}){return r}del({text:r}){return r}html({text:r}){return r}text({text:r}){return r}link({text:r}){return""+r}image({text:r}){return""+r}br(){return""}checkbox({raw:r}){return r}},w=class O{options;renderer;textRenderer;constructor(e){this.options=e||T,this.options.renderer=this.options.renderer||new E,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new F}static parse(e,n){return new O(n).parse(e)}static parseInline(e,n){return new O(n).parseInline(e)}parse(e){let n="";for(let s=0;s<e.length;s++){let t=e[s];if(this.options.extensions?.renderers?.[t.type]){let i=t,o=this.options.extensions.renderers[i.type].call({parser:this},i);if(o!==!1||!["space","hr","heading","code","table","blockquote","list","html","def","paragraph","text"].includes(i.type)){n+=o||"";continue}}let l=t;switch(l.type){case"space":{n+=this.renderer.space(l);break}case"hr":{n+=this.renderer.hr(l);break}case"heading":{n+=this.renderer.heading(l);break}case"code":{n+=this.renderer.code(l);break}case"table":{n+=this.renderer.table(l);break}case"blockquote":{n+=this.renderer.blockquote(l);break}case"list":{n+=this.renderer.list(l);break}case"checkbox":{n+=this.renderer.checkbox(l);break}case"html":{n+=this.renderer.html(l);break}case"def":{n+=this.renderer.def(l);break}case"paragraph":{n+=this.renderer.paragraph(l);break}case"text":{n+=this.renderer.text(l);break}default:{let i='Token with "'+l.type+'" type was not found.';if(this.options.silent)return console.error(i),"";throw new Error(i)}}}return n}parseInline(e,n=this.renderer){let s="";for(let t=0;t<e.length;t++){let l=e[t];if(this.options.extensions?.renderers?.[l.type]){let o=this.options.extensions.renderers[l.type].call({parser:this},l);if(o!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(l.type)){s+=o||"";continue}}let i=l;switch(i.type){case"escape":{s+=n.text(i);break}case"html":{s+=n.html(i);break}case"link":{s+=n.link(i);break}case"image":{s+=n.image(i);break}case"checkbox":{s+=n.checkbox(i);break}case"strong":{s+=n.strong(i);break}case"em":{s+=n.em(i);break}case"codespan":{s+=n.codespan(i);break}case"br":{s+=n.br(i);break}case"del":{s+=n.del(i);break}case"text":{s+=n.text(i);break}default:{let o='Token with "'+i.type+'" type was not found.';if(this.options.silent)return console.error(o),"";throw new Error(o)}}}return s}},A=class{options;block;constructor(r){this.options=r||T}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens","emStrongMask"]);static passThroughHooksRespectAsync=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(r){return r}postprocess(r){return r}processAllTokens(r){return r}emStrongMask(r){return r}provideLexer(){return this.block?x.lex:x.lexInline}provideParser(){return this.block?w.parse:w.parseInline}},Ke=class{defaults=H();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=w;Renderer=E;TextRenderer=F;Lexer=x;Tokenizer=_;Hooks=A;constructor(...r){this.use(...r)}walkTokens(r,e){let n=[];for(let s of r)switch(n=n.concat(e.call(this,s)),s.type){case"table":{let t=s;for(let l of t.header)n=n.concat(this.walkTokens(l.tokens,e));for(let l of t.rows)for(let i of l)n=n.concat(this.walkTokens(i.tokens,e));break}case"list":{let t=s;n=n.concat(this.walkTokens(t.items,e));break}default:{let t=s;this.defaults.extensions?.childTokens?.[t.type]?this.defaults.extensions.childTokens[t.type].forEach(l=>{let i=t[l].flat(1/0);n=n.concat(this.walkTokens(i,e))}):t.tokens&&(n=n.concat(this.walkTokens(t.tokens,e)))}}return n}use(...r){let e=this.defaults.extensions||{renderers:{},childTokens:{}};return r.forEach(n=>{let s={...n};if(s.async=this.defaults.async||s.async||!1,n.extensions&&(n.extensions.forEach(t=>{if(!t.name)throw new Error("extension name required");if("renderer"in t){let l=e.renderers[t.name];l?e.renderers[t.name]=function(...i){let o=t.renderer.apply(this,i);return o===!1&&(o=l.apply(this,i)),o}:e.renderers[t.name]=t.renderer}if("tokenizer"in t){if(!t.level||t.level!=="block"&&t.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let l=e[t.level];l?l.unshift(t.tokenizer):e[t.level]=[t.tokenizer],t.start&&(t.level==="block"?e.startBlock?e.startBlock.push(t.start):e.startBlock=[t.start]:t.level==="inline"&&(e.startInline?e.startInline.push(t.start):e.startInline=[t.start]))}"childTokens"in t&&t.childTokens&&(e.childTokens[t.name]=t.childTokens)}),s.extensions=e),n.renderer){let t=this.defaults.renderer||new E(this.defaults);for(let l in n.renderer){if(!(l in t))throw new Error(`renderer '${l}' does not exist`);if(["options","parser"].includes(l))continue;let i=l,o=n.renderer[i],a=t[i];t[i]=(...h)=>{let c=o.apply(t,h);return c===!1&&(c=a.apply(t,h)),c||""}}s.renderer=t}if(n.tokenizer){let t=this.defaults.tokenizer||new _(this.defaults);for(let l in n.tokenizer){if(!(l in t))throw new Error(`tokenizer '${l}' does not exist`);if(["options","rules","lexer"].includes(l))continue;let i=l,o=n.tokenizer[i],a=t[i];t[i]=(...h)=>{let c=o.apply(t,h);return c===!1&&(c=a.apply(t,h)),c}}s.tokenizer=t}if(n.hooks){let t=this.defaults.hooks||new A;for(let l in n.hooks){if(!(l in t))throw new Error(`hook '${l}' does not exist`);if(["options","block"].includes(l))continue;let i=l,o=n.hooks[i],a=t[i];A.passThroughHooks.has(l)?t[i]=h=>{if(this.defaults.async&&A.passThroughHooksRespectAsync.has(l))return(async()=>{let g=await o.call(t,h);return a.call(t,g)})();let c=o.call(t,h);return a.call(t,c)}:t[i]=(...h)=>{if(this.defaults.async)return(async()=>{let g=await o.apply(t,h);return g===!1&&(g=await a.apply(t,h)),g})();let c=o.apply(t,h);return c===!1&&(c=a.apply(t,h)),c}}s.hooks=t}if(n.walkTokens){let t=this.defaults.walkTokens,l=n.walkTokens;s.walkTokens=function(i){let o=[];return o.push(l.call(this,i)),t&&(o=o.concat(t.call(this,i))),o}}this.defaults={...this.defaults,...s}}),this}setOptions(r){return this.defaults={...this.defaults,...r},this}lexer(r,e){return x.lex(r,e??this.defaults)}parser(r,e){return w.parse(r,e??this.defaults)}parseMarkdown(r){return(e,n)=>{let s={...n},t={...this.defaults,...s},l=this.onError(!!t.silent,!!t.async);if(this.defaults.async===!0&&s.async===!1)return l(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof e>"u"||e===null)return l(new Error("marked(): input parameter is undefined or null"));if(typeof e!="string")return l(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(e)+", string expected"));if(t.hooks&&(t.hooks.options=t,t.hooks.block=r),t.async)return(async()=>{let i=t.hooks?await t.hooks.preprocess(e):e,o=await(t.hooks?await t.hooks.provideLexer():r?x.lex:x.lexInline)(i,t),a=t.hooks?await t.hooks.processAllTokens(o):o;t.walkTokens&&await Promise.all(this.walkTokens(a,t.walkTokens));let h=await(t.hooks?await t.hooks.provideParser():r?w.parse:w.parseInline)(a,t);return t.hooks?await t.hooks.postprocess(h):h})().catch(l);try{t.hooks&&(e=t.hooks.preprocess(e));let i=(t.hooks?t.hooks.provideLexer():r?x.lex:x.lexInline)(e,t);t.hooks&&(i=t.hooks.processAllTokens(i)),t.walkTokens&&this.walkTokens(i,t.walkTokens);let o=(t.hooks?t.hooks.provideParser():r?w.parse:w.parseInline)(i,t);return t.hooks&&(o=t.hooks.postprocess(o)),o}catch(i){return l(i)}}}onError(r,e){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,r){let s="<p>An error occurred:</p><pre>"+y(n.message+"",!0)+"</pre>";return e?Promise.resolve(s):s}if(e)return Promise.reject(n);throw n}}},S=new Ke;function d(r,e){return S.parse(r,e)}d.options=d.setOptions=function(r){return S.setOptions(r),d.defaults=S.defaults,se(d.defaults),d};d.getDefaults=H;d.defaults=T;d.use=function(...r){return S.use(...r),d.defaults=S.defaults,se(d.defaults),d};d.walkTokens=function(r,e){return S.walkTokens(r,e)};d.parseInline=S.parseInline;d.Parser=w;d.parser=w.parse;d.Renderer=E;d.TextRenderer=F;d.Lexer=x;d.lexer=x.lex;d.Tokenizer=_;d.Hooks=A;d.parse=d;d.options;d.setOptions;d.use;d.walkTokens;d.parseInline;w.parse;x.lex;export{st as _,rt as a,nt as b,tt as c,d,et as e,Ye as f};
