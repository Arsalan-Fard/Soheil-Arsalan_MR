(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))r(t);new MutationObserver(t=>{for(const a of t)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function n(t){const a={};return t.integrity&&(a.integrity=t.integrity),t.referrerPolicy&&(a.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?a.credentials="include":t.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(t){if(t.ep)return;t.ep=!0;const a=n(t);fetch(t.href,a)}})();const _e=[{title:"Presentations and Project",meta:"Main Track",body:"The project subject is Locomotion. You can see presentations, demos and final project in this path.",tags:["projects","main"],isProjects:!0,slug:"main-track"},{title:"Lab Assignments",meta:"Lab Track",body:"This path shows lab assignments. You can see unity projects about a ball in Telecom paris!",tags:["lab","assignments"],isLabAssignments:!0,slug:"lab-track"},{title:"Tutorials",meta:"Tutorial Track",body:"Learn how to setup a blog like this. And also how to setup Unity 6 for your VR projects.",tags:["Tutorial","theory"],isTutorialAssignments:!0,slug:"tutorial-track"},{title:"Lab 01: Roll a Ball",meta:"2026.01.06",body:"A ball in Telecom Paris!",tags:["Unity","C#"],isLabRoute:!0,slug:"lab-01",image:"images/1.png",link:"https://github.com/soheil1lotfi/Soheil-Arsalan-MixedReality-Projects/tree/main/rollaball-normal"},{title:"Lab 02: The VR Ball",meta:"2026.01.14",body:"How to run the ball project in VR.",tags:["Unity","C#","VR"],isLabRoute:!0,slug:"lab-02",image:"images/3.png",link:"https://github.com/soheil1lotfi/Soheil-Arsalan-MixedReality-Projects/tree/main/Rollaballvr-selection"},{title:"Tutorial 01: Blog Setup",meta:"2025.12.18",body:"Quick tips about how this blog is created and deployed on github.",tags:["Sass","Vite","GitHub Pages"],isTutorialRoute:!0,slug:"tutorial-01",image:"images/blog_image.jpg"},{title:"Tutorial 02: Unity Setup",meta:"2025.12.20",body:"This section provides you quick tips about how to setup Unity 6.",tags:["Unity 6","Microsoft Visual Studio"],isTutorialRoute:!0,slug:"tutorial-02",image:"images/unity_setup_image.jpg"},{title:"Presentation 01: Three Locomotion Techniques",meta:"2025.12.08",body:"First presentation.",tags:["Presentation","Locomotion","VR"],isProjectRoute:!0,slug:"project-01",slides:"1",image:"images/4.png"},{title:"Presentation 02: Our Locomotion Technique",meta:"2026.01.20",body:"Second Presentation.",tags:["Presentation","Locomotion","VR"],isProjectRoute:!0,slug:"project-02",slides:"2",image:"images/5.jpg"},{title:"Final Presentation: Magic Broom",meta:"2026.02.04",body:"Final presentation",tags:["Project","Locomotion","MR"],isProjectRoute:!0,slug:"project-03",slides:"3",image:"images/6.png",link:"https://github.com/soheil1lotfi/Soheil-Arsalan-MixedReality-Projects/tree/main/VR-locomotion-Soheil-Arsalan"}],ae=2300,E=_e.reduce((s,e,n)=>(n<=2||(e.isLabRoute?s.lab+=1:e.isTutorialRoute?s.tutorial+=1:s.project+=1),s),{lab:0,tutorial:0,project:0}),Y=ae*Math.cos(Math.PI/4),xe=Math.max(E.project*ae,E.lab*Y,E.tutorial*Y),rt=xe,it=5400,at=650,lt=`In this section we create a game called "Roll a Ball" based on the official Unity tutorial "https://learn.unity.com/project/roll-a-ball".

![Game Environment](/rollaball/1.png "Game Environment")

The theme is "Telecom Paris master student." As the player, we control a ball and collect 12 courses, each worth 5 ECTS. After collecting a course, an hourglass appears near the ball and follows the player. Each hourglass lasts for 60 seconds. In total, the player has 365 seconds to collect all courses. There is also a health bar in the canteen that gives the player one extra chance to get hit by deadlines.

![Gameplay](rollaball/gameplay.gif "Gameplay")

Below are the implemented features.

## 1. Ball Design

The ball is an .stl model converted to .fbx in Blender. It has a light inside that increases in intensity as the ECTS value increases.

![Ball light comparison](rollaball/2.png "Ball light comparison")

## 2. Environment Design

While the main design is implemented manually, most objects are free assets from the Unity Asset Store.

## 3. Ball Movement

The ball movement in this project is more advanced than in the tutorial. We can freely move the camera, we defined acceleration for smoother movement, and we added a jump mechanic. The code for this part is below.

\`\`\`csharp
private void FixedUpdate()
{
    Vector3 movementDirection = Vector3.zero;

    if (cameraTransform != null)
    {
        Vector3 camForward = cameraTransform.forward;
        Vector3 camRight = cameraTransform.right;

        camForward.y = 0;
        camRight.y = 0;
        camForward.Normalize();
        camRight.Normalize();

        movementDirection = (camForward * movementY + camRight * movementX).normalized;
    }
    else
    {
        movementDirection = new Vector3(movementX, 0.0f, movementY);
    }

    rb.AddForce(movementDirection * acceleration, ForceMode.Acceleration);

    Vector3 horizontalVelocity = new Vector3(rb.linearVelocity.x, 0f, rb.linearVelocity.z);
    if (horizontalVelocity.magnitude > maxSpeed)
    {
        Vector3 limited = horizontalVelocity.normalized * maxSpeed;
        rb.linearVelocity = new Vector3(limited.x, rb.linearVelocity.y, limited.z);
    }
}

void OnJump(InputValue movementValue)
{
    // Specific check for ball shape.
    if (Physics.Raycast(transform.position, Vector3.down, GetComponent<Collider>().bounds.extents.y + 0.1f))
    {
        rb.AddForce(Vector3.up * jumpForce, ForceMode.Impulse);
    }
}
\`\`\`

## 4. Player Health Bar

The player health bar is a simple "hearts" UI on a Canvas. The player only has one health in the list at the start of the game. The health value is stored on the player in PlayerController as playerHealth. It is initialized in Start() and pushed to the UI via healthUI.SetHealth(playerHealth). When the player takes damage by colliding with an object tagged "Deadline," it decrements playerHealth, updates the hearts, and destroys that deadline object. When the player heals by entering a trigger tagged "Cantine," it increments playerHealth, updates the hearts, and destroys the pickup. The UI always shows the current integer health value.

![Player Healthbar](rollaball/5.png "Player Healthbar")

## 5. AI Movement

The hourglass movement follows the tutorial. We define a NavMesh for the environment and assign the hourglasses as NavMesh agents to follow the player. Then we define collision with the player so that, on contact, the player loses a heart. We do this by defining a tag called "Deadline" and assigning it to the hourglasses:

\`\`\`csharp
if (collision.gameObject.CompareTag("Deadline"))
{
    if (playerHealth <= 0)
    {
        LoseGame();
    }
    else
    {
        playerHealth -= 1;
        healthUI.SetHealth(playerHealth);

        Destroy(collision.gameObject);
    }
}
\`\`\`

![Nav Mesh](rollaball/6.png "Nav Mesh")


## 6. Deadlines Appearance and Perish

![Enemy Spawn](rollaball/3.png "Enemy Spawn")

When we collect a collectible (ECTS), we call ActivateEnemy() to activate or enable the hourglass. It already has a predefined location, so spawning only requires activating visibility.

\`\`\`csharp
private void OnTriggerEnter(Collider other)
{
    if (other.CompareTag("Player"))
    {
        PlayerController player = other.GetComponentInParent<PlayerController>();
        if (player != null)
        {
            player.AddEcts(5);
        }

        ActivateEnemy();
    }
}

void ActivateEnemy()
{
    if (linkedEnemy != null)
    {
        if (linkedEnemy.transform.IsChildOf(transform))
        {
            linkedEnemy.transform.SetParent(null, true);
        }

        linkedEnemy.SetActive(true);
    }

    Destroy(gameObject);
}
\`\`\`

For despawning, we define a 60-second lifetime after which they are destroyed.

\`\`\`csharp
private IEnumerator DespawnAfterLifetime()
{
    yield return new WaitForSeconds(lifetimeSeconds);

    if (despawnParticles != null)
    {
        despawnParticles.transform.SetParent(null, true);
        despawnParticles.Play();
        Destroy(despawnParticles.gameObject, despawnDelay);
    }

    Destroy(gameObject);
}
\`\`\`

## 7. Win Mechanism

When the player triggers an ECTS collectible, it calls player.AddEcts(5) on PlayerController, which increments the private ECTS counter and updates the UI text. In PlayerController.cs, AddEcts checks if (ECTS >= 60) and, once that threshold is reached, it shows the graduation UI, pauses gameplay by setting Time.timeScale = 0f, and destroys a Deadline object via Destroy(GameObject.FindGameObjectWithTag("Deadline")).

![Enemy Spawn](rollaball/4.png "Enemy Spawn")
`,ot=`This part covers the tools and settings to build and run a Roll-a-Ball game on a Meta Quest headset. The goal is simple: get a working \`.apk\` running on the device before we touch gameplay code.

# Installing the required apps

## A) Meta Horizon app (mobile)

Install Meta Horizon on your phone. Pair the phone with the headset and then enable Developer Mode.

## B) Meta Quest Developer Hub (MQDH) (desktop)

Install Meta Quest Developer Hub on your PC. Enable USB debugging so you can install/uninstall \`.apk\` builds quickly.

Sign in with the same Meta account used on the headset. Then connect the headset via USB and accept the USB Debugging prompt inside the headset.

# Turn on Developer Mode for the headset

To build and run apps, the headset must be in Developer Mode. Create a Meta Developer account (Meta Developer Dashboard). In the Meta Horizon mobile app go to Menu → Devices → Developer Mode and toggle Developer Mode On.

# Set up Android build support in Unity

To build a Quest \`.apk\`, Unity must have Android modules installed.

In Unity Hub, find the Unity version you are using and install Android Build Support, Android SDK & NDK Tools, and OpenJDK.

# Unity project settings for Quest VR

## A) Switch platform to Android (or Meta Quest)

In the Unity project go to File → Build Settings and select Android (or Meta Quest), then click Switch Platform.

## B) Set texture compression

Set Texture Compression to ASTC (recommended for Quest).

## C) Enable XR for Quest (OpenXR)

Go to Edit → Project Settings → XR Plug-in Management. Under Android, enable OpenXR.

Then go to Project Settings → XR Plug-in Management → OpenXR.

Recommended settings:
- Enable Meta Quest support / Oculus profile (depends on Unity version).
- Stereo Rendering Mode: Multiview (good performance on Quest).
- Enable the relevant OpenXR interaction profiles (Meta/Oculus controller profile).

If you use XR Interaction Toolkit, it typically expects OpenXR + the Input System.

# Player settings (Android)

Go to Edit → Project Settings → Player → Android.

Recommended settings:
- Scripting Backend: IL2CPP
- Target Architectures: ARM64 (Quest requires 64-bit)
- Minimum API Level: choose a Quest-compatible Android version (use Unity/Meta recommendations)
- Active Input Handling: Input System Package (or Both if you still use the old input)
- Color Space: Linear (recommended for modern lighting; keep consistent with your pipeline)
- Graphics API: Vulkan (or OpenGLES3 depending on your project and render pipeline)

Optional but useful:
- Package Name (e.g., \`com.yourname.rollaballvr\`)
- Company Name / Product Name
- App icon (makes it easier to find on the headset)

# Add the correct scene(s) to Build Settings

Even if the Scene view looks correct in the editor, the device build will show an empty world if your intended scene is not included in the build.

Go to File → Build Settings.

Make sure:
- Your VR scene (e.g., \`MiniGame.unity\`) is checked and listed.
- It is placed at the top if it should be the first scene loaded.

This is one of the most common “works in editor, empty in headset” causes.

# Build and run on the headset

From Unity:
- Go to File → Build Settings.
- Ensure the headset is connected and recognized.
- Click Build And Run.

If the app installs but you see a blank scene:
- Confirm the correct scene order in Build Settings.
- Confirm the scene contains an XR Origin / XR Rig and an XR-compatible camera setup.
- Check logs in MQDH (crashes or missing shaders show up quickly).
`,ct=`![Lecture 01](/images/4.png)

![Slide 1](/slides/Locomotion Techniques2_page-0001.jpg)
![Slide 2](/slides/Locomotion Techniques2_page-0002.jpg)
![Slide 3](/slides/Locomotion Techniques2_page-0003.jpg)
![Slide 4](/slides/Locomotion Techniques2_page-0004.jpg)
![Slide 5](/slides/Locomotion Techniques2_page-0005.jpg)
![Slide 6](/slides/Locomotion Techniques2_page-0006.jpg)
![Slide 7](/slides/Locomotion Techniques2_page-0007.jpg)
![Slide 8](/slides/Locomotion Techniques2_page-0008.jpg)
![Slide 9](/slides/Locomotion Techniques2_page-0009.jpg)
![Slide 10](/slides/Locomotion Techniques2_page-0010.jpg)
![Slide 11](/slides/Locomotion Techniques2_page-0011.jpg)
![Slide 12](/slides/Locomotion Techniques2_page-0012.jpg)
![Slide 13](/slides/Locomotion Techniques2_page-0013.jpg)

Content for Lecture 1: VR Fails will go here.
`,ht=`![Project 01](/images/5.jpg)

Content for Final Project: Locomotion will go here.
`,pt=`This section provides you quick tips about how this blog is created and deployed on github.


## 1. Requirements

This blog is strongly inspired by "https://codepen.io/Vedant-Jain-the-bold/pen/dywQPLz".

To build this blog, we selected a lightweight but powerful stack (we need node js for these):

### **SCSS (Sass)**
We use **SCSS** for styling.
*   **Why?** The 3D environment in this blog is actually built using **CSS 3D Transforms**, not WebGL or Three.js! SCSS allows us to use variables and math functions to easily manage the complex \`transform\` and \`perspective\` properties. And also allows us to use cool projects from codepen.


### **Vite**
We use **Vite** as our build tool and development server. 
*   **Why?** It is incredibly fast and bundles our assets efficiently to make sure the moving around this 3d environment is smooth.


### **JavaScript (ES Modules)**
We use vanilla **JavaScript**.
*   **Why?** Since we are manipulating DOM elements for the 3D effect, we don't need the overhead of a heavy framework like React or Angular. We use modern ES Modules to keep our code organized (e.g., separating \`camera.js\`, \`map.js\`, and \`data.js\`).

### **Marked**
We use the **marked** library.
*   **Why?** This allows us to write blog posts in **Markdown** (like this one!) and have them automatically converted to HTML. This separates our content from our code.

## 2. Development

The core concept of this blog is a "CSS 3D Scroller".

1.  **The Scene**: We create a \`div\` with \`perspective: 1000px\`.
2.  **The World**: We place a "world" container inside and move it along the Z-axis based on the user's scroll.
3.  **The Objects**: Posts are HTML elements positioned absolutely using \`transform: translate3d(...)\`.

This approach gives us a 3D feeling while keeping the text selectable and the performance high on standard browsers.

## 3. Deployment

We use **GitHub Pages** for hosting.


*   **Process**: We use the \`gh-pages\` package. You can follow the instructions in image below to set it up.

![Blog Setup 1](blog_setup/github.png)

*   **Command**: Running "\`npm run deploy\`" builds the project (using Vite) into a \`dist\` folder and pushes that folder to a special branch on GitHub,.
`,ut=`In this tutorial, we will walk through the process of setting up the Unity game engine and Visual Studio Code.

## 1. Install Unity Hub

First, download and install Unity Hub from the official Unity website. Unity Hub is the management tool for all your Unity projects and editor versions.

   ![Unity Hub Installation Interface](unity_setup/1.png "Unity Hub Installation")

## 2. Install Visual Studio Code

We use Visual Studio Code as our code editor. Download it and ensure you install the "C# Dev Kit" or "C#" extension to enable IntelliSense and debugging features.

   ![Visual Studio Code Setup](unity_setup/2.png "VS Code Setup")

## 3. Create a New Project

Open Unity Hub, navigate to the "Projects" tab, and click "New Project". Select the "3D Core" template to start with a clean 3D environment.

   ![Creating a new 3D Project in Unity Hub](unity_setup/3.png "New Project Selection")

## 4. Project Configuration

Name your project (e.g., \`MR Locomotion\`) and choose a location on your drive. Click "Create Project" and wait for the Unity Editor to initialize.

   ![Project Configuration and Initialization](unity_setup/4.png "Project Initialization")

`,gt="/Soheil-Arsalan_MR/assets/Locomotion%20Techniques2_page-0001-CNbOZYwj.jpg",dt="/Soheil-Arsalan_MR/assets/Locomotion%20Techniques2_page-0002-CAUdKdE2.jpg",ft="/Soheil-Arsalan_MR/assets/Locomotion%20Techniques2_page-0003-B1u9fDkT.jpg",mt="/Soheil-Arsalan_MR/assets/Locomotion%20Techniques2_page-0004-D0F5OmPM.jpg",kt="/Soheil-Arsalan_MR/assets/Locomotion%20Techniques2_page-0005-CXlBEBWa.jpg",bt="/Soheil-Arsalan_MR/assets/Locomotion%20Techniques2_page-0006-boxv9pJ9.jpg",_t="/Soheil-Arsalan_MR/assets/Locomotion%20Techniques2_page-0007-OWwrmmsL.jpg",xt="/Soheil-Arsalan_MR/assets/Locomotion%20Techniques2_page-0008-CE8G5-66.jpg",wt="/Soheil-Arsalan_MR/assets/Locomotion%20Techniques2_page-0009-CAOwgO6-.jpg",yt="/Soheil-Arsalan_MR/assets/Locomotion%20Techniques2_page-0010-_ruUiPZb.jpg",St="/Soheil-Arsalan_MR/assets/Locomotion%20Techniques2_page-0011-COKYK1X7.jpg",Rt="/Soheil-Arsalan_MR/assets/Locomotion%20Techniques2_page-0012-B0O9kVnW.jpg",Tt="/Soheil-Arsalan_MR/assets/Locomotion%20Techniques2_page-0013-D8Mq2Vz1.jpg",vt="/Soheil-Arsalan_MR/assets/Presentation1_page-0001-Bhzzo3lv.jpg",At="/Soheil-Arsalan_MR/assets/Presentation1_page-0002-BypXF5c5.jpg",Pt="/Soheil-Arsalan_MR/assets/Presentation1_page-0003-n13XoTlE.jpg",jt="/Soheil-Arsalan_MR/assets/Presentation1_page-0004-BuJ05SL0.jpg",Mt="/Soheil-Arsalan_MR/assets/Presentation1_page-0005-Dq7tKQWn.jpg",$t="/Soheil-Arsalan_MR/assets/Presentation1_page-0006-DtA6cS8-.jpg",Ct="/Soheil-Arsalan_MR/assets/Presentation1_page-0007-Dr1pv5r-.jpg",Lt="/Soheil-Arsalan_MR/assets/3665463.3678838_page-0001-D63l5kuf.jpg",zt="/Soheil-Arsalan_MR/assets/3665463.3678838_page-0002-B6cTLIZr.gif",It="/Soheil-Arsalan_MR/assets/3665463.3678838_page-0003-C-B1446e.jpg",Dt="/Soheil-Arsalan_MR/assets/3665463.3678838_page-0004-DtczvELp.jpg",Et="/Soheil-Arsalan_MR/assets/3665463.3678838_page-0005-heveDRmF.jpg",Bt="/Soheil-Arsalan_MR/assets/3665463.3678838_page-0006-DEG-N7O6.jpg",qt="/Soheil-Arsalan_MR/assets/3665463.3678838_page-0007-ChNjpbBl.jpg",Ot="/Soheil-Arsalan_MR/assets/3665463.3678838_page-0008-BbILRo5F.jpg",Ht="/Soheil-Arsalan_MR/assets/3665463.3678838_page-0009-BaG5OnQz.jpg",Ut="/Soheil-Arsalan_MR/assets/3665463.3678838_page-0010-CiudiBW0.jpg",Vt="/Soheil-Arsalan_MR/assets/3665463.3678838_page-0011-B57W_7PB.jpg",Wt="/Soheil-Arsalan_MR/assets/3665463.3678838_page-0012-CvEnCRIE.jpg",Qt="/Soheil-Arsalan_MR/assets/3665463.3678838_page-0013-_-WQ2PTa.jpg",Ft="/Soheil-Arsalan_MR/assets/3665463.3678838_page-0014-DnyJ0l8I.jpg",Gt="/Soheil-Arsalan_MR/assets/3665463.3678838_page-0015-DabSgLsD.jpg",Nt="/Soheil-Arsalan_MR/assets/3665463.3678838_page-0016-CAqZ9pGg.jpg";function H(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var S=H();function le(s){S=s}var P={exec:()=>null};function p(s,e=""){let n=typeof s=="string"?s:s.source,r={replace:(t,a)=>{let i=typeof a=="string"?a:a.source;return i=i.replace(k.caret,"$1"),n=n.replace(t,i),r},getRegex:()=>new RegExp(n,e)};return r}var we=(()=>{try{return!!new RegExp("(?<=1)(?<!1)")}catch{return!1}})(),k={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceTabs:/^\t+/,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,unescapeTest:/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:s=>new RegExp(`^( {0,3}${s})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:s=>new RegExp(`^ {0,${Math.min(3,s-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:s=>new RegExp(`^ {0,${Math.min(3,s-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:s=>new RegExp(`^ {0,${Math.min(3,s-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:s=>new RegExp(`^ {0,${Math.min(3,s-1)}}#`),htmlBeginRegex:s=>new RegExp(`^ {0,${Math.min(3,s-1)}}<(?:[a-z].*>|!--)`,"i")},ye=/^(?:[ \t]*(?:\n|$))+/,Se=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,Re=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,j=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,Te=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,U=/(?:[*+-]|\d{1,9}[.)])/,oe=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,ce=p(oe).replace(/bull/g,U).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),ve=p(oe).replace(/bull/g,U).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),V=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,Ae=/^[^\n]+/,W=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,Pe=p(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",W).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),je=p(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,U).getRegex(),z="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",Q=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,Me=p("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",Q).replace("tag",z).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),he=p(V).replace("hr",j).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",z).getRegex(),$e=p(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",he).getRegex(),F={blockquote:$e,code:Se,def:Pe,fences:Re,heading:Te,hr:j,html:Me,lheading:ce,list:je,newline:ye,paragraph:he,table:P,text:Ae},ee=p("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",j).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",z).getRegex(),Ce={...F,lheading:ve,table:ee,paragraph:p(V).replace("hr",j).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",ee).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",z).getRegex()},Le={...F,html:p(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",Q).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:P,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:p(V).replace("hr",j).replace("heading",` *#{1,6} *[^
]`).replace("lheading",ce).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},ze=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,Ie=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,pe=/^( {2,}|\\)\n(?!\s*$)/,De=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,I=/[\p{P}\p{S}]/u,G=/[\s\p{P}\p{S}]/u,ue=/[^\s\p{P}\p{S}]/u,Ee=p(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,G).getRegex(),ge=/(?!~)[\p{P}\p{S}]/u,Be=/(?!~)[\s\p{P}\p{S}]/u,qe=/(?:[^\s\p{P}\p{S}]|~)/u,Oe=p(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",we?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),de=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,He=p(de,"u").replace(/punct/g,I).getRegex(),Ue=p(de,"u").replace(/punct/g,ge).getRegex(),fe="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",Ve=p(fe,"gu").replace(/notPunctSpace/g,ue).replace(/punctSpace/g,G).replace(/punct/g,I).getRegex(),We=p(fe,"gu").replace(/notPunctSpace/g,qe).replace(/punctSpace/g,Be).replace(/punct/g,ge).getRegex(),Qe=p("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,ue).replace(/punctSpace/g,G).replace(/punct/g,I).getRegex(),Fe=p(/\\(punct)/,"gu").replace(/punct/g,I).getRegex(),Ge=p(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Ne=p(Q).replace("(?:-->|$)","-->").getRegex(),Ze=p("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Ne).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),$=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/,Xe=p(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label",$).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),me=p(/^!?\[(label)\]\[(ref)\]/).replace("label",$).replace("ref",W).getRegex(),ke=p(/^!?\[(ref)\](?:\[\])?/).replace("ref",W).getRegex(),Ke=p("reflink|nolink(?!\\()","g").replace("reflink",me).replace("nolink",ke).getRegex(),te=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,N={_backpedal:P,anyPunctuation:Fe,autolink:Ge,blockSkip:Oe,br:pe,code:Ie,del:P,emStrongLDelim:He,emStrongRDelimAst:Ve,emStrongRDelimUnd:Qe,escape:ze,link:Xe,nolink:ke,punctuation:Ee,reflink:me,reflinkSearch:Ke,tag:Ze,text:De,url:P},Je={...N,link:p(/^!?\[(label)\]\((.*?)\)/).replace("label",$).getRegex(),reflink:p(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",$).getRegex()},B={...N,emStrongRDelimAst:We,emStrongLDelim:Ue,url:p(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol",te).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:p(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol",te).getRegex()},Ye={...B,br:p(pe).replace("{2,}","*").getRegex(),text:p(B.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},M={normal:F,gfm:Ce,pedantic:Le},T={normal:N,gfm:B,breaks:Ye,pedantic:Je},et={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},ne=s=>et[s];function w(s,e){if(e){if(k.escapeTest.test(s))return s.replace(k.escapeReplace,ne)}else if(k.escapeTestNoEncode.test(s))return s.replace(k.escapeReplaceNoEncode,ne);return s}function se(s){try{s=encodeURI(s).replace(k.percentDecode,"%")}catch{return null}return s}function re(s,e){let n=s.replace(k.findPipe,(a,i,o)=>{let l=!1,h=i;for(;--h>=0&&o[h]==="\\";)l=!l;return l?"|":" |"}),r=n.split(k.splitPipe),t=0;if(r[0].trim()||r.shift(),r.length>0&&!r.at(-1)?.trim()&&r.pop(),e)if(r.length>e)r.splice(e);else for(;r.length<e;)r.push("");for(;t<r.length;t++)r[t]=r[t].trim().replace(k.slashPipe,"|");return r}function v(s,e,n){let r=s.length;if(r===0)return"";let t=0;for(;t<r&&s.charAt(r-t-1)===e;)t++;return s.slice(0,r-t)}function tt(s,e){if(s.indexOf(e[1])===-1)return-1;let n=0;for(let r=0;r<s.length;r++)if(s[r]==="\\")r++;else if(s[r]===e[0])n++;else if(s[r]===e[1]&&(n--,n<0))return r;return n>0?-2:-1}function ie(s,e,n,r,t){let a=e.href,i=e.title||null,o=s[1].replace(t.other.outputLinkReplace,"$1");r.state.inLink=!0;let l={type:s[0].charAt(0)==="!"?"image":"link",raw:n,href:a,title:i,text:o,tokens:r.inlineTokens(o)};return r.state.inLink=!1,l}function nt(s,e,n){let r=s.match(n.other.indentCodeCompensation);if(r===null)return e;let t=r[1];return e.split(`
`).map(a=>{let i=a.match(n.other.beginningSpace);if(i===null)return a;let[o]=i;return o.length>=t.length?a.slice(t.length):a}).join(`
`)}var C=class{options;rules;lexer;constructor(s){this.options=s||S}space(s){let e=this.rules.block.newline.exec(s);if(e&&e[0].length>0)return{type:"space",raw:e[0]}}code(s){let e=this.rules.block.code.exec(s);if(e){let n=e[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:e[0],codeBlockStyle:"indented",text:this.options.pedantic?n:v(n,`
`)}}}fences(s){let e=this.rules.block.fences.exec(s);if(e){let n=e[0],r=nt(n,e[3]||"",this.rules);return{type:"code",raw:n,lang:e[2]?e[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):e[2],text:r}}}heading(s){let e=this.rules.block.heading.exec(s);if(e){let n=e[2].trim();if(this.rules.other.endingHash.test(n)){let r=v(n,"#");(this.options.pedantic||!r||this.rules.other.endingSpaceChar.test(r))&&(n=r.trim())}return{type:"heading",raw:e[0],depth:e[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(s){let e=this.rules.block.hr.exec(s);if(e)return{type:"hr",raw:v(e[0],`
`)}}blockquote(s){let e=this.rules.block.blockquote.exec(s);if(e){let n=v(e[0],`
`).split(`
`),r="",t="",a=[];for(;n.length>0;){let i=!1,o=[],l;for(l=0;l<n.length;l++)if(this.rules.other.blockquoteStart.test(n[l]))o.push(n[l]),i=!0;else if(!i)o.push(n[l]);else break;n=n.slice(l);let h=o.join(`
`),c=h.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");r=r?`${r}
${h}`:h,t=t?`${t}
${c}`:c;let d=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(c,a,!0),this.lexer.state.top=d,n.length===0)break;let u=a.at(-1);if(u?.type==="code")break;if(u?.type==="blockquote"){let m=u,f=m.raw+`
`+n.join(`
`),b=this.blockquote(f);a[a.length-1]=b,r=r.substring(0,r.length-m.raw.length)+b.raw,t=t.substring(0,t.length-m.text.length)+b.text;break}else if(u?.type==="list"){let m=u,f=m.raw+`
`+n.join(`
`),b=this.list(f);a[a.length-1]=b,r=r.substring(0,r.length-u.raw.length)+b.raw,t=t.substring(0,t.length-m.raw.length)+b.raw,n=f.substring(a.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:r,tokens:a,text:t}}}list(s){let e=this.rules.block.list.exec(s);if(e){let n=e[1].trim(),r=n.length>1,t={type:"list",raw:"",ordered:r,start:r?+n.slice(0,-1):"",loose:!1,items:[]};n=r?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=r?n:"[*+-]");let a=this.rules.other.listItemRegex(n),i=!1;for(;s;){let l=!1,h="",c="";if(!(e=a.exec(s))||this.rules.block.hr.test(s))break;h=e[0],s=s.substring(h.length);let d=e[2].split(`
`,1)[0].replace(this.rules.other.listReplaceTabs,b=>" ".repeat(3*b.length)),u=s.split(`
`,1)[0],m=!d.trim(),f=0;if(this.options.pedantic?(f=2,c=d.trimStart()):m?f=e[1].length+1:(f=e[2].search(this.rules.other.nonSpaceChar),f=f>4?1:f,c=d.slice(f),f+=e[1].length),m&&this.rules.other.blankLine.test(u)&&(h+=u+`
`,s=s.substring(u.length+1),l=!0),!l){let b=this.rules.other.nextBulletRegex(f),X=this.rules.other.hrRegex(f),K=this.rules.other.fencesBeginRegex(f),J=this.rules.other.headingBeginRegex(f),be=this.rules.other.htmlBeginRegex(f);for(;s;){let D=s.split(`
`,1)[0],R;if(u=D,this.options.pedantic?(u=u.replace(this.rules.other.listReplaceNesting,"  "),R=u):R=u.replace(this.rules.other.tabCharGlobal,"    "),K.test(u)||J.test(u)||be.test(u)||b.test(u)||X.test(u))break;if(R.search(this.rules.other.nonSpaceChar)>=f||!u.trim())c+=`
`+R.slice(f);else{if(m||d.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||K.test(d)||J.test(d)||X.test(d))break;c+=`
`+u}!m&&!u.trim()&&(m=!0),h+=D+`
`,s=s.substring(D.length+1),d=R.slice(f)}}t.loose||(i?t.loose=!0:this.rules.other.doubleBlankLine.test(h)&&(i=!0)),t.items.push({type:"list_item",raw:h,task:!!this.options.gfm&&this.rules.other.listIsTask.test(c),loose:!1,text:c,tokens:[]}),t.raw+=h}let o=t.items.at(-1);if(o)o.raw=o.raw.trimEnd(),o.text=o.text.trimEnd();else return;t.raw=t.raw.trimEnd();for(let l of t.items){if(this.lexer.state.top=!1,l.tokens=this.lexer.blockTokens(l.text,[]),l.task){if(l.text=l.text.replace(this.rules.other.listReplaceTask,""),l.tokens[0]?.type==="text"||l.tokens[0]?.type==="paragraph"){l.tokens[0].raw=l.tokens[0].raw.replace(this.rules.other.listReplaceTask,""),l.tokens[0].text=l.tokens[0].text.replace(this.rules.other.listReplaceTask,"");for(let c=this.lexer.inlineQueue.length-1;c>=0;c--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[c].src)){this.lexer.inlineQueue[c].src=this.lexer.inlineQueue[c].src.replace(this.rules.other.listReplaceTask,"");break}}let h=this.rules.other.listTaskCheckbox.exec(l.raw);if(h){let c={type:"checkbox",raw:h[0]+" ",checked:h[0]!=="[ ]"};l.checked=c.checked,t.loose?l.tokens[0]&&["paragraph","text"].includes(l.tokens[0].type)&&"tokens"in l.tokens[0]&&l.tokens[0].tokens?(l.tokens[0].raw=c.raw+l.tokens[0].raw,l.tokens[0].text=c.raw+l.tokens[0].text,l.tokens[0].tokens.unshift(c)):l.tokens.unshift({type:"paragraph",raw:c.raw,text:c.raw,tokens:[c]}):l.tokens.unshift(c)}}if(!t.loose){let h=l.tokens.filter(d=>d.type==="space"),c=h.length>0&&h.some(d=>this.rules.other.anyLine.test(d.raw));t.loose=c}}if(t.loose)for(let l of t.items){l.loose=!0;for(let h of l.tokens)h.type==="text"&&(h.type="paragraph")}return t}}html(s){let e=this.rules.block.html.exec(s);if(e)return{type:"html",block:!0,raw:e[0],pre:e[1]==="pre"||e[1]==="script"||e[1]==="style",text:e[0]}}def(s){let e=this.rules.block.def.exec(s);if(e){let n=e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),r=e[2]?e[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",t=e[3]?e[3].substring(1,e[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):e[3];return{type:"def",tag:n,raw:e[0],href:r,title:t}}}table(s){let e=this.rules.block.table.exec(s);if(!e||!this.rules.other.tableDelimiter.test(e[2]))return;let n=re(e[1]),r=e[2].replace(this.rules.other.tableAlignChars,"").split("|"),t=e[3]?.trim()?e[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],a={type:"table",raw:e[0],header:[],align:[],rows:[]};if(n.length===r.length){for(let i of r)this.rules.other.tableAlignRight.test(i)?a.align.push("right"):this.rules.other.tableAlignCenter.test(i)?a.align.push("center"):this.rules.other.tableAlignLeft.test(i)?a.align.push("left"):a.align.push(null);for(let i=0;i<n.length;i++)a.header.push({text:n[i],tokens:this.lexer.inline(n[i]),header:!0,align:a.align[i]});for(let i of t)a.rows.push(re(i,a.header.length).map((o,l)=>({text:o,tokens:this.lexer.inline(o),header:!1,align:a.align[l]})));return a}}lheading(s){let e=this.rules.block.lheading.exec(s);if(e)return{type:"heading",raw:e[0],depth:e[2].charAt(0)==="="?1:2,text:e[1],tokens:this.lexer.inline(e[1])}}paragraph(s){let e=this.rules.block.paragraph.exec(s);if(e){let n=e[1].charAt(e[1].length-1)===`
`?e[1].slice(0,-1):e[1];return{type:"paragraph",raw:e[0],text:n,tokens:this.lexer.inline(n)}}}text(s){let e=this.rules.block.text.exec(s);if(e)return{type:"text",raw:e[0],text:e[0],tokens:this.lexer.inline(e[0])}}escape(s){let e=this.rules.inline.escape.exec(s);if(e)return{type:"escape",raw:e[0],text:e[1]}}tag(s){let e=this.rules.inline.tag.exec(s);if(e)return!this.lexer.state.inLink&&this.rules.other.startATag.test(e[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(e[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(e[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(e[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:e[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:e[0]}}link(s){let e=this.rules.inline.link.exec(s);if(e){let n=e[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;let a=v(n.slice(0,-1),"\\");if((n.length-a.length)%2===0)return}else{let a=tt(e[2],"()");if(a===-2)return;if(a>-1){let i=(e[0].indexOf("!")===0?5:4)+e[1].length+a;e[2]=e[2].substring(0,a),e[0]=e[0].substring(0,i).trim(),e[3]=""}}let r=e[2],t="";if(this.options.pedantic){let a=this.rules.other.pedanticHrefTitle.exec(r);a&&(r=a[1],t=a[3])}else t=e[3]?e[3].slice(1,-1):"";return r=r.trim(),this.rules.other.startAngleBracket.test(r)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?r=r.slice(1):r=r.slice(1,-1)),ie(e,{href:r&&r.replace(this.rules.inline.anyPunctuation,"$1"),title:t&&t.replace(this.rules.inline.anyPunctuation,"$1")},e[0],this.lexer,this.rules)}}reflink(s,e){let n;if((n=this.rules.inline.reflink.exec(s))||(n=this.rules.inline.nolink.exec(s))){let r=(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal," "),t=e[r.toLowerCase()];if(!t){let a=n[0].charAt(0);return{type:"text",raw:a,text:a}}return ie(n,t,n[0],this.lexer,this.rules)}}emStrong(s,e,n=""){let r=this.rules.inline.emStrongLDelim.exec(s);if(!(!r||r[3]&&n.match(this.rules.other.unicodeAlphaNumeric))&&(!(r[1]||r[2])||!n||this.rules.inline.punctuation.exec(n))){let t=[...r[0]].length-1,a,i,o=t,l=0,h=r[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(h.lastIndex=0,e=e.slice(-1*s.length+t);(r=h.exec(e))!=null;){if(a=r[1]||r[2]||r[3]||r[4]||r[5]||r[6],!a)continue;if(i=[...a].length,r[3]||r[4]){o+=i;continue}else if((r[5]||r[6])&&t%3&&!((t+i)%3)){l+=i;continue}if(o-=i,o>0)continue;i=Math.min(i,i+o+l);let c=[...r[0]][0].length,d=s.slice(0,t+r.index+c+i);if(Math.min(t,i)%2){let m=d.slice(1,-1);return{type:"em",raw:d,text:m,tokens:this.lexer.inlineTokens(m)}}let u=d.slice(2,-2);return{type:"strong",raw:d,text:u,tokens:this.lexer.inlineTokens(u)}}}}codespan(s){let e=this.rules.inline.code.exec(s);if(e){let n=e[2].replace(this.rules.other.newLineCharGlobal," "),r=this.rules.other.nonSpaceChar.test(n),t=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return r&&t&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:e[0],text:n}}}br(s){let e=this.rules.inline.br.exec(s);if(e)return{type:"br",raw:e[0]}}del(s){let e=this.rules.inline.del.exec(s);if(e)return{type:"del",raw:e[0],text:e[2],tokens:this.lexer.inlineTokens(e[2])}}autolink(s){let e=this.rules.inline.autolink.exec(s);if(e){let n,r;return e[2]==="@"?(n=e[1],r="mailto:"+n):(n=e[1],r=n),{type:"link",raw:e[0],text:n,href:r,tokens:[{type:"text",raw:n,text:n}]}}}url(s){let e;if(e=this.rules.inline.url.exec(s)){let n,r;if(e[2]==="@")n=e[0],r="mailto:"+n;else{let t;do t=e[0],e[0]=this.rules.inline._backpedal.exec(e[0])?.[0]??"";while(t!==e[0]);n=e[0],e[1]==="www."?r="http://"+e[0]:r=e[0]}return{type:"link",raw:e[0],text:n,href:r,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(s){let e=this.rules.inline.text.exec(s);if(e){let n=this.lexer.state.inRawBlock;return{type:"text",raw:e[0],text:e[0],escaped:n}}}},_=class q{tokens;options;state;inlineQueue;tokenizer;constructor(e){this.tokens=[],this.tokens.links=Object.create(null),this.options=e||S,this.options.tokenizer=this.options.tokenizer||new C,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let n={other:k,block:M.normal,inline:T.normal};this.options.pedantic?(n.block=M.pedantic,n.inline=T.pedantic):this.options.gfm&&(n.block=M.gfm,this.options.breaks?n.inline=T.breaks:n.inline=T.gfm),this.tokenizer.rules=n}static get rules(){return{block:M,inline:T}}static lex(e,n){return new q(n).lex(e)}static lexInline(e,n){return new q(n).inlineTokens(e)}lex(e){e=e.replace(k.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let n=0;n<this.inlineQueue.length;n++){let r=this.inlineQueue[n];this.inlineTokens(r.src,r.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,n=[],r=!1){for(this.options.pedantic&&(e=e.replace(k.tabCharGlobal,"    ").replace(k.spaceLine,""));e;){let t;if(this.options.extensions?.block?.some(i=>(t=i.call({lexer:this},e,n))?(e=e.substring(t.raw.length),n.push(t),!0):!1))continue;if(t=this.tokenizer.space(e)){e=e.substring(t.raw.length);let i=n.at(-1);t.raw.length===1&&i!==void 0?i.raw+=`
`:n.push(t);continue}if(t=this.tokenizer.code(e)){e=e.substring(t.raw.length);let i=n.at(-1);i?.type==="paragraph"||i?.type==="text"?(i.raw+=(i.raw.endsWith(`
`)?"":`
`)+t.raw,i.text+=`
`+t.text,this.inlineQueue.at(-1).src=i.text):n.push(t);continue}if(t=this.tokenizer.fences(e)){e=e.substring(t.raw.length),n.push(t);continue}if(t=this.tokenizer.heading(e)){e=e.substring(t.raw.length),n.push(t);continue}if(t=this.tokenizer.hr(e)){e=e.substring(t.raw.length),n.push(t);continue}if(t=this.tokenizer.blockquote(e)){e=e.substring(t.raw.length),n.push(t);continue}if(t=this.tokenizer.list(e)){e=e.substring(t.raw.length),n.push(t);continue}if(t=this.tokenizer.html(e)){e=e.substring(t.raw.length),n.push(t);continue}if(t=this.tokenizer.def(e)){e=e.substring(t.raw.length);let i=n.at(-1);i?.type==="paragraph"||i?.type==="text"?(i.raw+=(i.raw.endsWith(`
`)?"":`
`)+t.raw,i.text+=`
`+t.raw,this.inlineQueue.at(-1).src=i.text):this.tokens.links[t.tag]||(this.tokens.links[t.tag]={href:t.href,title:t.title},n.push(t));continue}if(t=this.tokenizer.table(e)){e=e.substring(t.raw.length),n.push(t);continue}if(t=this.tokenizer.lheading(e)){e=e.substring(t.raw.length),n.push(t);continue}let a=e;if(this.options.extensions?.startBlock){let i=1/0,o=e.slice(1),l;this.options.extensions.startBlock.forEach(h=>{l=h.call({lexer:this},o),typeof l=="number"&&l>=0&&(i=Math.min(i,l))}),i<1/0&&i>=0&&(a=e.substring(0,i+1))}if(this.state.top&&(t=this.tokenizer.paragraph(a))){let i=n.at(-1);r&&i?.type==="paragraph"?(i.raw+=(i.raw.endsWith(`
`)?"":`
`)+t.raw,i.text+=`
`+t.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=i.text):n.push(t),r=a.length!==e.length,e=e.substring(t.raw.length);continue}if(t=this.tokenizer.text(e)){e=e.substring(t.raw.length);let i=n.at(-1);i?.type==="text"?(i.raw+=(i.raw.endsWith(`
`)?"":`
`)+t.raw,i.text+=`
`+t.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=i.text):n.push(t);continue}if(e){let i="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(i);break}else throw new Error(i)}}return this.state.top=!0,n}inline(e,n=[]){return this.inlineQueue.push({src:e,tokens:n}),n}inlineTokens(e,n=[]){let r=e,t=null;if(this.tokens.links){let l=Object.keys(this.tokens.links);if(l.length>0)for(;(t=this.tokenizer.rules.inline.reflinkSearch.exec(r))!=null;)l.includes(t[0].slice(t[0].lastIndexOf("[")+1,-1))&&(r=r.slice(0,t.index)+"["+"a".repeat(t[0].length-2)+"]"+r.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(t=this.tokenizer.rules.inline.anyPunctuation.exec(r))!=null;)r=r.slice(0,t.index)+"++"+r.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let a;for(;(t=this.tokenizer.rules.inline.blockSkip.exec(r))!=null;)a=t[2]?t[2].length:0,r=r.slice(0,t.index+a)+"["+"a".repeat(t[0].length-a-2)+"]"+r.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);r=this.options.hooks?.emStrongMask?.call({lexer:this},r)??r;let i=!1,o="";for(;e;){i||(o=""),i=!1;let l;if(this.options.extensions?.inline?.some(c=>(l=c.call({lexer:this},e,n))?(e=e.substring(l.raw.length),n.push(l),!0):!1))continue;if(l=this.tokenizer.escape(e)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.tag(e)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.link(e)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(l.raw.length);let c=n.at(-1);l.type==="text"&&c?.type==="text"?(c.raw+=l.raw,c.text+=l.text):n.push(l);continue}if(l=this.tokenizer.emStrong(e,r,o)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.codespan(e)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.br(e)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.del(e)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.autolink(e)){e=e.substring(l.raw.length),n.push(l);continue}if(!this.state.inLink&&(l=this.tokenizer.url(e))){e=e.substring(l.raw.length),n.push(l);continue}let h=e;if(this.options.extensions?.startInline){let c=1/0,d=e.slice(1),u;this.options.extensions.startInline.forEach(m=>{u=m.call({lexer:this},d),typeof u=="number"&&u>=0&&(c=Math.min(c,u))}),c<1/0&&c>=0&&(h=e.substring(0,c+1))}if(l=this.tokenizer.inlineText(h)){e=e.substring(l.raw.length),l.raw.slice(-1)!=="_"&&(o=l.raw.slice(-1)),i=!0;let c=n.at(-1);c?.type==="text"?(c.raw+=l.raw,c.text+=l.text):n.push(l);continue}if(e){let c="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(c);break}else throw new Error(c)}}return n}},L=class{options;parser;constructor(s){this.options=s||S}space(s){return""}code({text:s,lang:e,escaped:n}){let r=(e||"").match(k.notSpaceStart)?.[0],t=s.replace(k.endingNewline,"")+`
`;return r?'<pre><code class="language-'+w(r)+'">'+(n?t:w(t,!0))+`</code></pre>
`:"<pre><code>"+(n?t:w(t,!0))+`</code></pre>
`}blockquote({tokens:s}){return`<blockquote>
${this.parser.parse(s)}</blockquote>
`}html({text:s}){return s}def(s){return""}heading({tokens:s,depth:e}){return`<h${e}>${this.parser.parseInline(s)}</h${e}>
`}hr(s){return`<hr>
`}list(s){let e=s.ordered,n=s.start,r="";for(let i=0;i<s.items.length;i++){let o=s.items[i];r+=this.listitem(o)}let t=e?"ol":"ul",a=e&&n!==1?' start="'+n+'"':"";return"<"+t+a+`>
`+r+"</"+t+`>
`}listitem(s){return`<li>${this.parser.parse(s.tokens)}</li>
`}checkbox({checked:s}){return"<input "+(s?'checked="" ':"")+'disabled="" type="checkbox"> '}paragraph({tokens:s}){return`<p>${this.parser.parseInline(s)}</p>
`}table(s){let e="",n="";for(let t=0;t<s.header.length;t++)n+=this.tablecell(s.header[t]);e+=this.tablerow({text:n});let r="";for(let t=0;t<s.rows.length;t++){let a=s.rows[t];n="";for(let i=0;i<a.length;i++)n+=this.tablecell(a[i]);r+=this.tablerow({text:n})}return r&&(r=`<tbody>${r}</tbody>`),`<table>
<thead>
`+e+`</thead>
`+r+`</table>
`}tablerow({text:s}){return`<tr>
${s}</tr>
`}tablecell(s){let e=this.parser.parseInline(s.tokens),n=s.header?"th":"td";return(s.align?`<${n} align="${s.align}">`:`<${n}>`)+e+`</${n}>
`}strong({tokens:s}){return`<strong>${this.parser.parseInline(s)}</strong>`}em({tokens:s}){return`<em>${this.parser.parseInline(s)}</em>`}codespan({text:s}){return`<code>${w(s,!0)}</code>`}br(s){return"<br>"}del({tokens:s}){return`<del>${this.parser.parseInline(s)}</del>`}link({href:s,title:e,tokens:n}){let r=this.parser.parseInline(n),t=se(s);if(t===null)return r;s=t;let a='<a href="'+s+'"';return e&&(a+=' title="'+w(e)+'"'),a+=">"+r+"</a>",a}image({href:s,title:e,text:n,tokens:r}){r&&(n=this.parser.parseInline(r,this.parser.textRenderer));let t=se(s);if(t===null)return w(n);s=t;let a=`<img src="${s}" alt="${n}"`;return e&&(a+=` title="${w(e)}"`),a+=">",a}text(s){return"tokens"in s&&s.tokens?this.parser.parseInline(s.tokens):"escaped"in s&&s.escaped?s.text:w(s.text)}},Z=class{strong({text:s}){return s}em({text:s}){return s}codespan({text:s}){return s}del({text:s}){return s}html({text:s}){return s}text({text:s}){return s}link({text:s}){return""+s}image({text:s}){return""+s}br(){return""}checkbox({raw:s}){return s}},x=class O{options;renderer;textRenderer;constructor(e){this.options=e||S,this.options.renderer=this.options.renderer||new L,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new Z}static parse(e,n){return new O(n).parse(e)}static parseInline(e,n){return new O(n).parseInline(e)}parse(e){let n="";for(let r=0;r<e.length;r++){let t=e[r];if(this.options.extensions?.renderers?.[t.type]){let i=t,o=this.options.extensions.renderers[i.type].call({parser:this},i);if(o!==!1||!["space","hr","heading","code","table","blockquote","list","html","def","paragraph","text"].includes(i.type)){n+=o||"";continue}}let a=t;switch(a.type){case"space":{n+=this.renderer.space(a);break}case"hr":{n+=this.renderer.hr(a);break}case"heading":{n+=this.renderer.heading(a);break}case"code":{n+=this.renderer.code(a);break}case"table":{n+=this.renderer.table(a);break}case"blockquote":{n+=this.renderer.blockquote(a);break}case"list":{n+=this.renderer.list(a);break}case"checkbox":{n+=this.renderer.checkbox(a);break}case"html":{n+=this.renderer.html(a);break}case"def":{n+=this.renderer.def(a);break}case"paragraph":{n+=this.renderer.paragraph(a);break}case"text":{n+=this.renderer.text(a);break}default:{let i='Token with "'+a.type+'" type was not found.';if(this.options.silent)return console.error(i),"";throw new Error(i)}}}return n}parseInline(e,n=this.renderer){let r="";for(let t=0;t<e.length;t++){let a=e[t];if(this.options.extensions?.renderers?.[a.type]){let o=this.options.extensions.renderers[a.type].call({parser:this},a);if(o!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(a.type)){r+=o||"";continue}}let i=a;switch(i.type){case"escape":{r+=n.text(i);break}case"html":{r+=n.html(i);break}case"link":{r+=n.link(i);break}case"image":{r+=n.image(i);break}case"checkbox":{r+=n.checkbox(i);break}case"strong":{r+=n.strong(i);break}case"em":{r+=n.em(i);break}case"codespan":{r+=n.codespan(i);break}case"br":{r+=n.br(i);break}case"del":{r+=n.del(i);break}case"text":{r+=n.text(i);break}default:{let o='Token with "'+i.type+'" type was not found.';if(this.options.silent)return console.error(o),"";throw new Error(o)}}}return r}},A=class{options;block;constructor(s){this.options=s||S}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens","emStrongMask"]);static passThroughHooksRespectAsync=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(s){return s}postprocess(s){return s}processAllTokens(s){return s}emStrongMask(s){return s}provideLexer(){return this.block?_.lex:_.lexInline}provideParser(){return this.block?x.parse:x.parseInline}},st=class{defaults=H();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=x;Renderer=L;TextRenderer=Z;Lexer=_;Tokenizer=C;Hooks=A;constructor(...s){this.use(...s)}walkTokens(s,e){let n=[];for(let r of s)switch(n=n.concat(e.call(this,r)),r.type){case"table":{let t=r;for(let a of t.header)n=n.concat(this.walkTokens(a.tokens,e));for(let a of t.rows)for(let i of a)n=n.concat(this.walkTokens(i.tokens,e));break}case"list":{let t=r;n=n.concat(this.walkTokens(t.items,e));break}default:{let t=r;this.defaults.extensions?.childTokens?.[t.type]?this.defaults.extensions.childTokens[t.type].forEach(a=>{let i=t[a].flat(1/0);n=n.concat(this.walkTokens(i,e))}):t.tokens&&(n=n.concat(this.walkTokens(t.tokens,e)))}}return n}use(...s){let e=this.defaults.extensions||{renderers:{},childTokens:{}};return s.forEach(n=>{let r={...n};if(r.async=this.defaults.async||r.async||!1,n.extensions&&(n.extensions.forEach(t=>{if(!t.name)throw new Error("extension name required");if("renderer"in t){let a=e.renderers[t.name];a?e.renderers[t.name]=function(...i){let o=t.renderer.apply(this,i);return o===!1&&(o=a.apply(this,i)),o}:e.renderers[t.name]=t.renderer}if("tokenizer"in t){if(!t.level||t.level!=="block"&&t.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let a=e[t.level];a?a.unshift(t.tokenizer):e[t.level]=[t.tokenizer],t.start&&(t.level==="block"?e.startBlock?e.startBlock.push(t.start):e.startBlock=[t.start]:t.level==="inline"&&(e.startInline?e.startInline.push(t.start):e.startInline=[t.start]))}"childTokens"in t&&t.childTokens&&(e.childTokens[t.name]=t.childTokens)}),r.extensions=e),n.renderer){let t=this.defaults.renderer||new L(this.defaults);for(let a in n.renderer){if(!(a in t))throw new Error(`renderer '${a}' does not exist`);if(["options","parser"].includes(a))continue;let i=a,o=n.renderer[i],l=t[i];t[i]=(...h)=>{let c=o.apply(t,h);return c===!1&&(c=l.apply(t,h)),c||""}}r.renderer=t}if(n.tokenizer){let t=this.defaults.tokenizer||new C(this.defaults);for(let a in n.tokenizer){if(!(a in t))throw new Error(`tokenizer '${a}' does not exist`);if(["options","rules","lexer"].includes(a))continue;let i=a,o=n.tokenizer[i],l=t[i];t[i]=(...h)=>{let c=o.apply(t,h);return c===!1&&(c=l.apply(t,h)),c}}r.tokenizer=t}if(n.hooks){let t=this.defaults.hooks||new A;for(let a in n.hooks){if(!(a in t))throw new Error(`hook '${a}' does not exist`);if(["options","block"].includes(a))continue;let i=a,o=n.hooks[i],l=t[i];A.passThroughHooks.has(a)?t[i]=h=>{if(this.defaults.async&&A.passThroughHooksRespectAsync.has(a))return(async()=>{let d=await o.call(t,h);return l.call(t,d)})();let c=o.call(t,h);return l.call(t,c)}:t[i]=(...h)=>{if(this.defaults.async)return(async()=>{let d=await o.apply(t,h);return d===!1&&(d=await l.apply(t,h)),d})();let c=o.apply(t,h);return c===!1&&(c=l.apply(t,h)),c}}r.hooks=t}if(n.walkTokens){let t=this.defaults.walkTokens,a=n.walkTokens;r.walkTokens=function(i){let o=[];return o.push(a.call(this,i)),t&&(o=o.concat(t.call(this,i))),o}}this.defaults={...this.defaults,...r}}),this}setOptions(s){return this.defaults={...this.defaults,...s},this}lexer(s,e){return _.lex(s,e??this.defaults)}parser(s,e){return x.parse(s,e??this.defaults)}parseMarkdown(s){return(e,n)=>{let r={...n},t={...this.defaults,...r},a=this.onError(!!t.silent,!!t.async);if(this.defaults.async===!0&&r.async===!1)return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof e>"u"||e===null)return a(new Error("marked(): input parameter is undefined or null"));if(typeof e!="string")return a(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(e)+", string expected"));if(t.hooks&&(t.hooks.options=t,t.hooks.block=s),t.async)return(async()=>{let i=t.hooks?await t.hooks.preprocess(e):e,o=await(t.hooks?await t.hooks.provideLexer():s?_.lex:_.lexInline)(i,t),l=t.hooks?await t.hooks.processAllTokens(o):o;t.walkTokens&&await Promise.all(this.walkTokens(l,t.walkTokens));let h=await(t.hooks?await t.hooks.provideParser():s?x.parse:x.parseInline)(l,t);return t.hooks?await t.hooks.postprocess(h):h})().catch(a);try{t.hooks&&(e=t.hooks.preprocess(e));let i=(t.hooks?t.hooks.provideLexer():s?_.lex:_.lexInline)(e,t);t.hooks&&(i=t.hooks.processAllTokens(i)),t.walkTokens&&this.walkTokens(i,t.walkTokens);let o=(t.hooks?t.hooks.provideParser():s?x.parse:x.parseInline)(i,t);return t.hooks&&(o=t.hooks.postprocess(o)),o}catch(i){return a(i)}}}onError(s,e){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,s){let r="<p>An error occurred:</p><pre>"+w(n.message+"",!0)+"</pre>";return e?Promise.resolve(r):r}if(e)return Promise.reject(n);throw n}}},y=new st;function g(s,e){return y.parse(s,e)}g.options=g.setOptions=function(s){return y.setOptions(s),g.defaults=y.defaults,le(g.defaults),g};g.getDefaults=H;g.defaults=S;g.use=function(...s){return y.use(...s),g.defaults=y.defaults,le(g.defaults),g};g.walkTokens=function(s,e){return y.walkTokens(s,e)};g.parseInline=y.parseInline;g.Parser=x;g.parser=x.parse;g.Renderer=L;g.TextRenderer=Z;g.Lexer=_;g.lexer=_.lex;g.Tokenizer=C;g.Hooks=A;g.parse=g;g.options;g.setOptions;g.use;g.walkTokens;g.parseInline;x.parse;_.lex;export{St as A,yt as B,wt as C,xt as D,_t as E,bt as F,kt as G,mt as H,ft as I,dt as J,gt as K,g as L,ut as M,pt as N,ht as O,ct as P,ot as Q,lt as R,it as S,at as T,Nt as _,Gt as a,Ft as b,Qt as c,Wt as d,Vt as e,Ut as f,Ht as g,Ot as h,qt as i,Bt as j,Et as k,Dt as l,It as m,zt as n,Lt as o,_e as p,Ct as q,$t as r,Mt as s,rt as t,jt as u,Pt as v,At as w,vt as x,Tt as y,Rt as z};
