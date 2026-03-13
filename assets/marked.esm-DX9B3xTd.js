(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))s(t);new MutationObserver(t=>{for(const i of t)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function n(t){const i={};return t.integrity&&(i.integrity=t.integrity),t.referrerPolicy&&(i.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?i.credentials="include":t.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(t){if(t.ep)return;t.ep=!0;const i=n(t);fetch(t.href,i)}})();const ye=[{title:"Presentations and Project",meta:"Main Track",body:"The project subject is Locomotion. You can see presentations, demos and final project in this path.",tags:["projects","main"],isProjects:!0,slug:"main-track"},{title:"Lab Assignments",meta:"Lab Track",body:"This path shows lab assignments. You can see unity projects about a ball in Telecom paris!",tags:["lab","assignments"],isLabAssignments:!0,slug:"lab-track"},{title:"Tutorials",meta:"Tutorial Track",body:"Learn how to setup a blog like this. And also how to setup Unity 6 for your VR projects.",tags:["Tutorial","theory"],isTutorialAssignments:!0,slug:"tutorial-track"},{title:"Lab 01: Roll a Ball",meta:"2026.01.06",body:"A ball in Telecom Paris!",tags:["Unity","C#"],isLabRoute:!0,slug:"lab-01",image:"images/1.png",link:"https://github.com/soheil1lotfi/Soheil-Arsalan-MixedReality-Projects/tree/main/rollaball-normal"},{title:"Lab 02: The VR Ball",meta:"2026.01.14",body:"How to run the ball project in VR.",tags:["Unity","C#","VR"],isLabRoute:!0,slug:"lab-02",image:"images/3.png",link:"https://github.com/soheil1lotfi/Soheil-Arsalan-MixedReality-Projects/tree/main/Rollaballvr-selection"},{title:"Tutorial 01: Blog Setup",meta:"2025.12.18",body:"Quick tips about how this blog is created and deployed on github.",tags:["Sass","Vite","GitHub Pages"],isTutorialRoute:!0,slug:"tutorial-01",image:"images/blog_image.jpg"},{title:"Tutorial 02: Unity Setup",meta:"2025.12.20",body:"This section provides you quick tips about how to setup Unity 6.",tags:["Unity 6","Microsoft Visual Studio"],isTutorialRoute:!0,slug:"tutorial-02",image:"images/unity_setup_image.jpg"},{title:"Presentation 01: Three Locomotion Techniques",meta:"2025.12.08",body:"First presentation.",tags:["Presentation","Locomotion","VR"],isProjectRoute:!0,slug:"project-01",slides:"1",image:"images/4.png"},{title:"Presentation 02: Our Locomotion Technique",meta:"2026.01.20",body:"Second Presentation.",tags:["Presentation","Locomotion","VR"],isProjectRoute:!0,slug:"project-02",slides:"2",image:"images/5.jpg"},{title:"Final Presentation: Magic Broom",meta:"2026.02.04",body:"Final presentation",tags:["Project","Locomotion","MR"],isProjectRoute:!0,slug:"project-03",slides:"3",image:"images/6.png",link:"https://github.com/soheil1lotfi/Soheil-Arsalan-MixedReality-Projects/tree/main/VR-locomotion-Soheil-Arsalan"}],ie=2300,E=ye.reduce((r,e,n)=>(n<=2||(e.isLabRoute?r.lab+=1:e.isTutorialRoute?r.tutorial+=1:r.project+=1),r),{lab:0,tutorial:0,project:0}),Y=ie*Math.cos(Math.PI/4),we=Math.max(E.project*ie,E.lab*Y,E.tutorial*Y),st=we,at=5400,it=650,lt=`In this section we create a game called "Roll a Ball" based on the official Unity tutorial "https://learn.unity.com/project/roll-a-ball".\r
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
`,ot=`In this section we adapt the "Roll a Ball" game from Lab 01 into a fully playable VR experience on the Meta Quest headset, based on the lab assignment "VR Selection."\r
\r
<video width="100%" controls autoplay loop muted playsinline>\r
  <source src="vrball/gameplay.mp4" type="video/mp4">\r
</video>\r
\r
The theme remains "Telecom Paris master student." The player still controls a ball and collects 12 courses, each worth 5 ECTS, within 365 seconds. However, instead of hourglasses, a 3D model of our professor — generated with AI — now chases the player as the deadline agent. The player can fight back by grabbing and throwing objects at the agents, which triggers a custom dissolve shader effect. There is still a health bar in the canteen that gives the player one extra chance to get hit by deadlines.\r
\r
Below are the implemented features and how they differ from Lab 01.\r
\r
## 1. VR Ball Movement\r
\r
In Lab 01 the ball was controlled with keyboard (WASD) and mouse. In VR, movement is driven by the left controller joystick. The direction is relative to where the VR headset is looking, so the player moves forward in the direction they face.\r
\r
\`\`\`csharp\r
void FixedUpdate()\r
{\r
    var leftHand = UnityEngine.XR.InputDevices.GetDeviceAtXRNode(UnityEngine.XR.XRNode.LeftHand);\r
    leftHand.TryGetFeatureValue(UnityEngine.XR.CommonUsages.primary2DAxis, out Vector2 joystickInput);\r
\r
    if (joystickInput.sqrMagnitude > 0.01f)\r
    {\r
        Vector3 forward = cameraTransform.forward;\r
        Vector3 right = cameraTransform.right;\r
        forward.y = 0;\r
        right.y = 0;\r
        forward.Normalize();\r
        right.Normalize();\r
\r
        Vector3 moveDirection = (forward * joystickInput.y + right * joystickInput.x);\r
        rb.AddForce(moveDirection * moveSpeed, ForceMode.Force);\r
    }\r
}\r
\`\`\`\r
\r
Turning is handled by the right controller joystick with smooth rotation. The rotation happens around the camera position so that it feels natural in VR.\r
\r
\`\`\`csharp\r
void Update()\r
{\r
    var rightHand = UnityEngine.XR.InputDevices.GetDeviceAtXRNode(UnityEngine.XR.XRNode.RightHand);\r
    rightHand.TryGetFeatureValue(UnityEngine.XR.CommonUsages.primary2DAxis, out Vector2 joystick);\r
\r
    if (Mathf.Abs(joystick.x) > 0.2f)\r
    {\r
        transform.RotateAround(Camera.main.transform.position, Vector3.up, joystick.x * turnSpeed * Time.deltaTime);\r
    }\r
}\r
\`\`\`\r
\r
Since the camera in VR is the headset itself (XR Origin), a \`VRFollowPlayer\` script keeps the XR rig anchored to the ball's position so the player always sees the game from behind the ball.\r
\r
## 2. Environment Design\r
\r
The environment is the same Telecom Paris campus from Lab 01, with adjustments for VR scale and comfort. The XR Interaction Toolkit Starter Assets are used to set up the XR Origin and controller input bindings.\r
\r
## 3. AI Agents (Professor 3D Model)\r
\r
Instead of the hourglasses from Lab 01, we use a 3D-scanned model of our course professor as the deadline agent. The model was generated with AI and imported as a Unity package. Like the hourglasses, the agents use NavMesh to follow the player.\r
\r
![3D Professor Model](vrball/daniel.png "3D Professor Model as AI Agent")\r
\r
The AI follower script uses NavMesh with a follow distance threshold so the agent stops when close enough to the player.\r
\r
\`\`\`csharp\r
void Update()\r
{\r
    float distance = Vector3.Distance(transform.position, player.position);\r
\r
    if (distance > followDistance)\r
    {\r
        agent.SetDestination(player.position);\r
    }\r
    else\r
    {\r
        agent.ResetPath();\r
    }\r
}\r
\`\`\`\r
\r
## 4. Custom Dissolve Shader\r
\r
When an agent is killed, it dissolves away using a custom Shader Graph. The shader takes a noise texture and uses the \`DissolveAmount\` property (0 to 1) to progressively cut away pixels. An edge color (glow) highlights the dissolve boundary.\r
\r
![Dissolve Shader Graph](vrball/shader.png "Dissolve Shader Graph")\r
\r
<video width="100%" controls autoplay loop muted playsinline>\r
  <source src="vrball/dissolve-effect.mp4" type="video/mp4">\r
</video>\r
\r
The shader exposes the following properties: EdgeColor, EdgeWidth, NoiseScale, BaseMap, BaseColor, MetallicMap, Smoothness, NormalMap, NormalScale, and DissolveAmount. In the \`DeadlineMovement\` script, when \`Die()\` is called, the dissolve amount is animated from 0 to 1 over time:\r
\r
\`\`\`csharp\r
public void Die()\r
{\r
    if (isDying) return;\r
    isDying = true;\r
    navMeshAgent.isStopped = true;\r
}\r
\r
void Update()\r
{\r
    if (isDying)\r
    {\r
        dissolveAmount += Time.deltaTime * dissolveSpeed;\r
        material.SetFloat("_DissolveAmount", dissolveAmount);\r
\r
        if (dissolveAmount >= 1f)\r
        {\r
            Destroy(gameObject);\r
        }\r
        return;\r
    }\r
\r
    if (player != null && navMeshAgent.isOnNavMesh)\r
    {\r
        navMeshAgent.SetDestination(player.position);\r
    }\r
}\r
\`\`\`\r
\r
## 5. Grab and Throw Mechanic\r
\r
This is a new VR-exclusive feature. The player uses the right controller to aim a laser pointer at throwable objects. Pulling the trigger grabs the object; releasing it throws it using the controller's velocity. When a thrown object hits an agent tagged "Enemy," it triggers the dissolve death.\r
\r
\`\`\`csharp\r
void TryGrab()\r
{\r
    Ray ray = new Ray(transform.position, transform.forward);\r
    if (Physics.Raycast(ray, out RaycastHit hit, grabRange, throwableLayer))\r
    {\r
        if (hit.collider.CompareTag("Throwable"))\r
        {\r
            heldObject = hit.collider.gameObject;\r
            heldRb = heldObject.GetComponent<Rigidbody>();\r
            heldRb.isKinematic = true;\r
            heldRb.useGravity = false;\r
        }\r
    }\r
}\r
\r
void ThrowObject()\r
{\r
    heldRb.isKinematic = false;\r
    heldRb.useGravity = true;\r
    heldRb.linearVelocity = controllerVelocity * throwForceMultiplier;\r
\r
    heldObject = null;\r
    heldRb = null;\r
}\r
\`\`\`\r
\r
The projectile script detects the collision and calls \`Die()\` on the agent:\r
\r
\`\`\`csharp\r
void OnCollisionEnter(Collision collision)\r
{\r
    if (collision.collider.CompareTag("Enemy"))\r
    {\r
        DeadlineMovement enemy = collision.collider.GetComponentInParent<DeadlineMovement>();\r
        if (enemy != null)\r
        {\r
            enemy.Die();\r
        }\r
        Destroy(gameObject);\r
    }\r
}\r
\`\`\`\r
\r
## 6. Deadline Health Bar\r
\r
Each deadline agent now has a visible health bar above its head that shrinks over its 60-second lifetime. This gives the player a visual indicator of how much time is left before the agent despawns on its own.\r
\r
\`\`\`csharp\r
void Update()\r
{\r
    t += Time.deltaTime / duration;\r
    float x = Mathf.Lerp(startScale.x, 0f, t);\r
    transform.localScale = new Vector3(x, startScale.y, startScale.z);\r
}\r
\`\`\`\r
\r
## 7. Deadlines Appearance and Perish\r
\r
Just like Lab 01, when the player collects an ECTS course, a linked deadline agent is activated. The collectible triggers \`ActivateEnemy()\` and then destroys itself. Each agent has a 60-second lifetime after which it is automatically destroyed with a particle effect.\r
\r
\`\`\`csharp\r
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
## 8. Player Health and Win Mechanism\r
\r
The health system and win condition remain identical to Lab 01. The player starts with 1 health, can gain extra health from the canteen, and loses health when hit by a deadline agent. Collecting 60 ECTS triggers graduation. The 365-second countdown still applies.\r
`,ct=`![Lecture 01](/images/4.png)\r
\r
![Slide 1](/slides/Locomotion Techniques2_page-0001.jpg)\r
![Slide 2](/slides/Locomotion Techniques2_page-0002.jpg)\r
![Slide 3](/slides/Locomotion Techniques2_page-0003.jpg)\r
![Slide 4](/slides/Locomotion Techniques2_page-0004.jpg)\r
![Slide 5](/slides/Locomotion Techniques2_page-0005.jpg)\r
![Slide 6](/slides/Locomotion Techniques2_page-0006.jpg)\r
![Slide 7](/slides/Locomotion Techniques2_page-0007.jpg)\r
![Slide 8](/slides/Locomotion Techniques2_page-0008.jpg)\r
![Slide 9](/slides/Locomotion Techniques2_page-0009.jpg)\r
![Slide 10](/slides/Locomotion Techniques2_page-0010.jpg)\r
![Slide 11](/slides/Locomotion Techniques2_page-0011.jpg)\r
![Slide 12](/slides/Locomotion Techniques2_page-0012.jpg)\r
![Slide 13](/slides/Locomotion Techniques2_page-0013.jpg)\r
\r
Content for Lecture 1: VR Fails will go here.\r
`,ht=`![Project 01](/images/5.jpg)\r
\r
Content for Final Project: Locomotion will go here.\r
`,pt=`This section provides you quick tips about how this blog is created and deployed on github.\r
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
`,ut=`In this tutorial, we will walk through the process of setting up the Unity game engine and Visual Studio Code.\r
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
`,gt="/Soheil-Arsalan_MR/assets/Locomotion%20Techniques2_page-0001-CNbOZYwj.jpg",dt="/Soheil-Arsalan_MR/assets/Locomotion%20Techniques2_page-0002-CAUdKdE2.jpg",ft="/Soheil-Arsalan_MR/assets/Locomotion%20Techniques2_page-0003-B1u9fDkT.jpg",mt="/Soheil-Arsalan_MR/assets/Locomotion%20Techniques2_page-0004-D0F5OmPM.jpg",bt="/Soheil-Arsalan_MR/assets/Locomotion%20Techniques2_page-0005-CXlBEBWa.jpg",kt="/Soheil-Arsalan_MR/assets/Locomotion%20Techniques2_page-0006-boxv9pJ9.jpg",yt="/Soheil-Arsalan_MR/assets/Locomotion%20Techniques2_page-0007-OWwrmmsL.jpg",wt="/Soheil-Arsalan_MR/assets/Locomotion%20Techniques2_page-0008-CE8G5-66.jpg",xt="/Soheil-Arsalan_MR/assets/Locomotion%20Techniques2_page-0009-CAOwgO6-.jpg",_t="/Soheil-Arsalan_MR/assets/Locomotion%20Techniques2_page-0010-_ruUiPZb.jpg",St="/Soheil-Arsalan_MR/assets/Locomotion%20Techniques2_page-0011-COKYK1X7.jpg",vt="/Soheil-Arsalan_MR/assets/Locomotion%20Techniques2_page-0012-B0O9kVnW.jpg",Tt="/Soheil-Arsalan_MR/assets/Locomotion%20Techniques2_page-0013-D8Mq2Vz1.jpg",Rt="/Soheil-Arsalan_MR/assets/Presentation1_page-0001-Bhzzo3lv.jpg",At="/Soheil-Arsalan_MR/assets/Presentation1_page-0002-BypXF5c5.jpg",jt="/Soheil-Arsalan_MR/assets/Presentation1_page-0003-n13XoTlE.jpg",Pt="/Soheil-Arsalan_MR/assets/Presentation1_page-0004-BuJ05SL0.jpg",$t="/Soheil-Arsalan_MR/assets/Presentation1_page-0005-Dq7tKQWn.jpg",Ct="/Soheil-Arsalan_MR/assets/Presentation1_page-0006-DtA6cS8-.jpg",Lt="/Soheil-Arsalan_MR/assets/Presentation1_page-0007-Dr1pv5r-.jpg",Mt="/Soheil-Arsalan_MR/assets/3665463.3678838_page-0001-D63l5kuf.jpg",Dt="/Soheil-Arsalan_MR/assets/3665463.3678838_page-0002-B6cTLIZr.gif",zt="/Soheil-Arsalan_MR/assets/3665463.3678838_page-0003-C-B1446e.jpg",It="/Soheil-Arsalan_MR/assets/3665463.3678838_page-0004-DtczvELp.jpg",Et="/Soheil-Arsalan_MR/assets/3665463.3678838_page-0005-heveDRmF.jpg",qt="/Soheil-Arsalan_MR/assets/3665463.3678838_page-0006-DEG-N7O6.jpg",Bt="/Soheil-Arsalan_MR/assets/3665463.3678838_page-0007-ChNjpbBl.jpg",Vt="/Soheil-Arsalan_MR/assets/3665463.3678838_page-0008-BbILRo5F.jpg",Ot="/Soheil-Arsalan_MR/assets/3665463.3678838_page-0009-BaG5OnQz.jpg",Ht="/Soheil-Arsalan_MR/assets/3665463.3678838_page-0010-CiudiBW0.jpg",Ut="/Soheil-Arsalan_MR/assets/3665463.3678838_page-0011-B57W_7PB.jpg",Wt="/Soheil-Arsalan_MR/assets/3665463.3678838_page-0012-CvEnCRIE.jpg",Gt="/Soheil-Arsalan_MR/assets/3665463.3678838_page-0013-_-WQ2PTa.jpg",Nt="/Soheil-Arsalan_MR/assets/3665463.3678838_page-0014-DnyJ0l8I.jpg",Ft="/Soheil-Arsalan_MR/assets/3665463.3678838_page-0015-DabSgLsD.jpg",Zt="/Soheil-Arsalan_MR/assets/3665463.3678838_page-0016-CAqZ9pGg.jpg";function O(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var S=O();function le(r){S=r}var j={exec:()=>null};function p(r,e=""){let n=typeof r=="string"?r:r.source,s={replace:(t,i)=>{let a=typeof i=="string"?i:i.source;return a=a.replace(b.caret,"$1"),n=n.replace(t,a),s},getRegex:()=>new RegExp(n,e)};return s}var xe=(()=>{try{return!!new RegExp("(?<=1)(?<!1)")}catch{return!1}})(),b={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceTabs:/^\t+/,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,unescapeTest:/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:r=>new RegExp(`^( {0,3}${r})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:r=>new RegExp(`^ {0,${Math.min(3,r-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:r=>new RegExp(`^ {0,${Math.min(3,r-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:r=>new RegExp(`^ {0,${Math.min(3,r-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:r=>new RegExp(`^ {0,${Math.min(3,r-1)}}#`),htmlBeginRegex:r=>new RegExp(`^ {0,${Math.min(3,r-1)}}<(?:[a-z].*>|!--)`,"i")},_e=/^(?:[ \t]*(?:\n|$))+/,Se=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,ve=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,P=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,Te=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,H=/(?:[*+-]|\d{1,9}[.)])/,oe=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,ce=p(oe).replace(/bull/g,H).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),Re=p(oe).replace(/bull/g,H).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),U=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,Ae=/^[^\n]+/,W=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,je=p(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",W).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),Pe=p(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,H).getRegex(),D="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",G=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,$e=p("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",G).replace("tag",D).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),he=p(U).replace("hr",P).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",D).getRegex(),Ce=p(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",he).getRegex(),N={blockquote:Ce,code:Se,def:je,fences:ve,heading:Te,hr:P,html:$e,lheading:ce,list:Pe,newline:_e,paragraph:he,table:j,text:Ae},ee=p("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",P).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",D).getRegex(),Le={...N,lheading:Re,table:ee,paragraph:p(U).replace("hr",P).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",ee).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",D).getRegex()},Me={...N,html:p(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",G).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:j,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:p(U).replace("hr",P).replace("heading",` *#{1,6} *[^
]`).replace("lheading",ce).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},De=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,ze=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,pe=/^( {2,}|\\)\n(?!\s*$)/,Ie=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,z=/[\p{P}\p{S}]/u,F=/[\s\p{P}\p{S}]/u,ue=/[^\s\p{P}\p{S}]/u,Ee=p(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,F).getRegex(),ge=/(?!~)[\p{P}\p{S}]/u,qe=/(?!~)[\s\p{P}\p{S}]/u,Be=/(?:[^\s\p{P}\p{S}]|~)/u,Ve=p(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",xe?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),de=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,Oe=p(de,"u").replace(/punct/g,z).getRegex(),He=p(de,"u").replace(/punct/g,ge).getRegex(),fe="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",Ue=p(fe,"gu").replace(/notPunctSpace/g,ue).replace(/punctSpace/g,F).replace(/punct/g,z).getRegex(),We=p(fe,"gu").replace(/notPunctSpace/g,Be).replace(/punctSpace/g,qe).replace(/punct/g,ge).getRegex(),Ge=p("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,ue).replace(/punctSpace/g,F).replace(/punct/g,z).getRegex(),Ne=p(/\\(punct)/,"gu").replace(/punct/g,z).getRegex(),Fe=p(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Ze=p(G).replace("(?:-->|$)","-->").getRegex(),Xe=p("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Ze).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),C=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/,Qe=p(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label",C).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),me=p(/^!?\[(label)\]\[(ref)\]/).replace("label",C).replace("ref",W).getRegex(),be=p(/^!?\[(ref)\](?:\[\])?/).replace("ref",W).getRegex(),Je=p("reflink|nolink(?!\\()","g").replace("reflink",me).replace("nolink",be).getRegex(),te=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,Z={_backpedal:j,anyPunctuation:Ne,autolink:Fe,blockSkip:Ve,br:pe,code:ze,del:j,emStrongLDelim:Oe,emStrongRDelimAst:Ue,emStrongRDelimUnd:Ge,escape:De,link:Qe,nolink:be,punctuation:Ee,reflink:me,reflinkSearch:Je,tag:Xe,text:Ie,url:j},Ke={...Z,link:p(/^!?\[(label)\]\((.*?)\)/).replace("label",C).getRegex(),reflink:p(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",C).getRegex()},q={...Z,emStrongRDelimAst:We,emStrongLDelim:He,url:p(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol",te).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:p(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol",te).getRegex()},Ye={...q,br:p(pe).replace("{2,}","*").getRegex(),text:p(q.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},$={normal:N,gfm:Le,pedantic:Me},T={normal:Z,gfm:q,breaks:Ye,pedantic:Ke},et={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},ne=r=>et[r];function x(r,e){if(e){if(b.escapeTest.test(r))return r.replace(b.escapeReplace,ne)}else if(b.escapeTestNoEncode.test(r))return r.replace(b.escapeReplaceNoEncode,ne);return r}function re(r){try{r=encodeURI(r).replace(b.percentDecode,"%")}catch{return null}return r}function se(r,e){let n=r.replace(b.findPipe,(i,a,o)=>{let l=!1,h=a;for(;--h>=0&&o[h]==="\\";)l=!l;return l?"|":" |"}),s=n.split(b.splitPipe),t=0;if(s[0].trim()||s.shift(),s.length>0&&!s.at(-1)?.trim()&&s.pop(),e)if(s.length>e)s.splice(e);else for(;s.length<e;)s.push("");for(;t<s.length;t++)s[t]=s[t].trim().replace(b.slashPipe,"|");return s}function R(r,e,n){let s=r.length;if(s===0)return"";let t=0;for(;t<s&&r.charAt(s-t-1)===e;)t++;return r.slice(0,s-t)}function tt(r,e){if(r.indexOf(e[1])===-1)return-1;let n=0;for(let s=0;s<r.length;s++)if(r[s]==="\\")s++;else if(r[s]===e[0])n++;else if(r[s]===e[1]&&(n--,n<0))return s;return n>0?-2:-1}function ae(r,e,n,s,t){let i=e.href,a=e.title||null,o=r[1].replace(t.other.outputLinkReplace,"$1");s.state.inLink=!0;let l={type:r[0].charAt(0)==="!"?"image":"link",raw:n,href:i,title:a,text:o,tokens:s.inlineTokens(o)};return s.state.inLink=!1,l}function nt(r,e,n){let s=r.match(n.other.indentCodeCompensation);if(s===null)return e;let t=s[1];return e.split(`
`).map(i=>{let a=i.match(n.other.beginningSpace);if(a===null)return i;let[o]=a;return o.length>=t.length?i.slice(t.length):i}).join(`
`)}var L=class{options;rules;lexer;constructor(r){this.options=r||S}space(r){let e=this.rules.block.newline.exec(r);if(e&&e[0].length>0)return{type:"space",raw:e[0]}}code(r){let e=this.rules.block.code.exec(r);if(e){let n=e[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:e[0],codeBlockStyle:"indented",text:this.options.pedantic?n:R(n,`
`)}}}fences(r){let e=this.rules.block.fences.exec(r);if(e){let n=e[0],s=nt(n,e[3]||"",this.rules);return{type:"code",raw:n,lang:e[2]?e[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):e[2],text:s}}}heading(r){let e=this.rules.block.heading.exec(r);if(e){let n=e[2].trim();if(this.rules.other.endingHash.test(n)){let s=R(n,"#");(this.options.pedantic||!s||this.rules.other.endingSpaceChar.test(s))&&(n=s.trim())}return{type:"heading",raw:e[0],depth:e[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(r){let e=this.rules.block.hr.exec(r);if(e)return{type:"hr",raw:R(e[0],`
`)}}blockquote(r){let e=this.rules.block.blockquote.exec(r);if(e){let n=R(e[0],`
`).split(`
`),s="",t="",i=[];for(;n.length>0;){let a=!1,o=[],l;for(l=0;l<n.length;l++)if(this.rules.other.blockquoteStart.test(n[l]))o.push(n[l]),a=!0;else if(!a)o.push(n[l]);else break;n=n.slice(l);let h=o.join(`
`),c=h.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");s=s?`${s}
${h}`:h,t=t?`${t}
${c}`:c;let d=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(c,i,!0),this.lexer.state.top=d,n.length===0)break;let u=i.at(-1);if(u?.type==="code")break;if(u?.type==="blockquote"){let m=u,f=m.raw+`
`+n.join(`
`),k=this.blockquote(f);i[i.length-1]=k,s=s.substring(0,s.length-m.raw.length)+k.raw,t=t.substring(0,t.length-m.text.length)+k.text;break}else if(u?.type==="list"){let m=u,f=m.raw+`
`+n.join(`
`),k=this.list(f);i[i.length-1]=k,s=s.substring(0,s.length-u.raw.length)+k.raw,t=t.substring(0,t.length-m.raw.length)+k.raw,n=f.substring(i.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:s,tokens:i,text:t}}}list(r){let e=this.rules.block.list.exec(r);if(e){let n=e[1].trim(),s=n.length>1,t={type:"list",raw:"",ordered:s,start:s?+n.slice(0,-1):"",loose:!1,items:[]};n=s?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=s?n:"[*+-]");let i=this.rules.other.listItemRegex(n),a=!1;for(;r;){let l=!1,h="",c="";if(!(e=i.exec(r))||this.rules.block.hr.test(r))break;h=e[0],r=r.substring(h.length);let d=e[2].split(`
`,1)[0].replace(this.rules.other.listReplaceTabs,k=>" ".repeat(3*k.length)),u=r.split(`
`,1)[0],m=!d.trim(),f=0;if(this.options.pedantic?(f=2,c=d.trimStart()):m?f=e[1].length+1:(f=e[2].search(this.rules.other.nonSpaceChar),f=f>4?1:f,c=d.slice(f),f+=e[1].length),m&&this.rules.other.blankLine.test(u)&&(h+=u+`
`,r=r.substring(u.length+1),l=!0),!l){let k=this.rules.other.nextBulletRegex(f),Q=this.rules.other.hrRegex(f),J=this.rules.other.fencesBeginRegex(f),K=this.rules.other.headingBeginRegex(f),ke=this.rules.other.htmlBeginRegex(f);for(;r;){let I=r.split(`
`,1)[0],v;if(u=I,this.options.pedantic?(u=u.replace(this.rules.other.listReplaceNesting,"  "),v=u):v=u.replace(this.rules.other.tabCharGlobal,"    "),J.test(u)||K.test(u)||ke.test(u)||k.test(u)||Q.test(u))break;if(v.search(this.rules.other.nonSpaceChar)>=f||!u.trim())c+=`
`+v.slice(f);else{if(m||d.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||J.test(d)||K.test(d)||Q.test(d))break;c+=`
`+u}!m&&!u.trim()&&(m=!0),h+=I+`
`,r=r.substring(I.length+1),d=v.slice(f)}}t.loose||(a?t.loose=!0:this.rules.other.doubleBlankLine.test(h)&&(a=!0)),t.items.push({type:"list_item",raw:h,task:!!this.options.gfm&&this.rules.other.listIsTask.test(c),loose:!1,text:c,tokens:[]}),t.raw+=h}let o=t.items.at(-1);if(o)o.raw=o.raw.trimEnd(),o.text=o.text.trimEnd();else return;t.raw=t.raw.trimEnd();for(let l of t.items){if(this.lexer.state.top=!1,l.tokens=this.lexer.blockTokens(l.text,[]),l.task){if(l.text=l.text.replace(this.rules.other.listReplaceTask,""),l.tokens[0]?.type==="text"||l.tokens[0]?.type==="paragraph"){l.tokens[0].raw=l.tokens[0].raw.replace(this.rules.other.listReplaceTask,""),l.tokens[0].text=l.tokens[0].text.replace(this.rules.other.listReplaceTask,"");for(let c=this.lexer.inlineQueue.length-1;c>=0;c--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[c].src)){this.lexer.inlineQueue[c].src=this.lexer.inlineQueue[c].src.replace(this.rules.other.listReplaceTask,"");break}}let h=this.rules.other.listTaskCheckbox.exec(l.raw);if(h){let c={type:"checkbox",raw:h[0]+" ",checked:h[0]!=="[ ]"};l.checked=c.checked,t.loose?l.tokens[0]&&["paragraph","text"].includes(l.tokens[0].type)&&"tokens"in l.tokens[0]&&l.tokens[0].tokens?(l.tokens[0].raw=c.raw+l.tokens[0].raw,l.tokens[0].text=c.raw+l.tokens[0].text,l.tokens[0].tokens.unshift(c)):l.tokens.unshift({type:"paragraph",raw:c.raw,text:c.raw,tokens:[c]}):l.tokens.unshift(c)}}if(!t.loose){let h=l.tokens.filter(d=>d.type==="space"),c=h.length>0&&h.some(d=>this.rules.other.anyLine.test(d.raw));t.loose=c}}if(t.loose)for(let l of t.items){l.loose=!0;for(let h of l.tokens)h.type==="text"&&(h.type="paragraph")}return t}}html(r){let e=this.rules.block.html.exec(r);if(e)return{type:"html",block:!0,raw:e[0],pre:e[1]==="pre"||e[1]==="script"||e[1]==="style",text:e[0]}}def(r){let e=this.rules.block.def.exec(r);if(e){let n=e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),s=e[2]?e[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",t=e[3]?e[3].substring(1,e[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):e[3];return{type:"def",tag:n,raw:e[0],href:s,title:t}}}table(r){let e=this.rules.block.table.exec(r);if(!e||!this.rules.other.tableDelimiter.test(e[2]))return;let n=se(e[1]),s=e[2].replace(this.rules.other.tableAlignChars,"").split("|"),t=e[3]?.trim()?e[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],i={type:"table",raw:e[0],header:[],align:[],rows:[]};if(n.length===s.length){for(let a of s)this.rules.other.tableAlignRight.test(a)?i.align.push("right"):this.rules.other.tableAlignCenter.test(a)?i.align.push("center"):this.rules.other.tableAlignLeft.test(a)?i.align.push("left"):i.align.push(null);for(let a=0;a<n.length;a++)i.header.push({text:n[a],tokens:this.lexer.inline(n[a]),header:!0,align:i.align[a]});for(let a of t)i.rows.push(se(a,i.header.length).map((o,l)=>({text:o,tokens:this.lexer.inline(o),header:!1,align:i.align[l]})));return i}}lheading(r){let e=this.rules.block.lheading.exec(r);if(e)return{type:"heading",raw:e[0],depth:e[2].charAt(0)==="="?1:2,text:e[1],tokens:this.lexer.inline(e[1])}}paragraph(r){let e=this.rules.block.paragraph.exec(r);if(e){let n=e[1].charAt(e[1].length-1)===`
`?e[1].slice(0,-1):e[1];return{type:"paragraph",raw:e[0],text:n,tokens:this.lexer.inline(n)}}}text(r){let e=this.rules.block.text.exec(r);if(e)return{type:"text",raw:e[0],text:e[0],tokens:this.lexer.inline(e[0])}}escape(r){let e=this.rules.inline.escape.exec(r);if(e)return{type:"escape",raw:e[0],text:e[1]}}tag(r){let e=this.rules.inline.tag.exec(r);if(e)return!this.lexer.state.inLink&&this.rules.other.startATag.test(e[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(e[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(e[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(e[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:e[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:e[0]}}link(r){let e=this.rules.inline.link.exec(r);if(e){let n=e[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;let i=R(n.slice(0,-1),"\\");if((n.length-i.length)%2===0)return}else{let i=tt(e[2],"()");if(i===-2)return;if(i>-1){let a=(e[0].indexOf("!")===0?5:4)+e[1].length+i;e[2]=e[2].substring(0,i),e[0]=e[0].substring(0,a).trim(),e[3]=""}}let s=e[2],t="";if(this.options.pedantic){let i=this.rules.other.pedanticHrefTitle.exec(s);i&&(s=i[1],t=i[3])}else t=e[3]?e[3].slice(1,-1):"";return s=s.trim(),this.rules.other.startAngleBracket.test(s)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?s=s.slice(1):s=s.slice(1,-1)),ae(e,{href:s&&s.replace(this.rules.inline.anyPunctuation,"$1"),title:t&&t.replace(this.rules.inline.anyPunctuation,"$1")},e[0],this.lexer,this.rules)}}reflink(r,e){let n;if((n=this.rules.inline.reflink.exec(r))||(n=this.rules.inline.nolink.exec(r))){let s=(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal," "),t=e[s.toLowerCase()];if(!t){let i=n[0].charAt(0);return{type:"text",raw:i,text:i}}return ae(n,t,n[0],this.lexer,this.rules)}}emStrong(r,e,n=""){let s=this.rules.inline.emStrongLDelim.exec(r);if(!(!s||s[3]&&n.match(this.rules.other.unicodeAlphaNumeric))&&(!(s[1]||s[2])||!n||this.rules.inline.punctuation.exec(n))){let t=[...s[0]].length-1,i,a,o=t,l=0,h=s[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(h.lastIndex=0,e=e.slice(-1*r.length+t);(s=h.exec(e))!=null;){if(i=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!i)continue;if(a=[...i].length,s[3]||s[4]){o+=a;continue}else if((s[5]||s[6])&&t%3&&!((t+a)%3)){l+=a;continue}if(o-=a,o>0)continue;a=Math.min(a,a+o+l);let c=[...s[0]][0].length,d=r.slice(0,t+s.index+c+a);if(Math.min(t,a)%2){let m=d.slice(1,-1);return{type:"em",raw:d,text:m,tokens:this.lexer.inlineTokens(m)}}let u=d.slice(2,-2);return{type:"strong",raw:d,text:u,tokens:this.lexer.inlineTokens(u)}}}}codespan(r){let e=this.rules.inline.code.exec(r);if(e){let n=e[2].replace(this.rules.other.newLineCharGlobal," "),s=this.rules.other.nonSpaceChar.test(n),t=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return s&&t&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:e[0],text:n}}}br(r){let e=this.rules.inline.br.exec(r);if(e)return{type:"br",raw:e[0]}}del(r){let e=this.rules.inline.del.exec(r);if(e)return{type:"del",raw:e[0],text:e[2],tokens:this.lexer.inlineTokens(e[2])}}autolink(r){let e=this.rules.inline.autolink.exec(r);if(e){let n,s;return e[2]==="@"?(n=e[1],s="mailto:"+n):(n=e[1],s=n),{type:"link",raw:e[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}url(r){let e;if(e=this.rules.inline.url.exec(r)){let n,s;if(e[2]==="@")n=e[0],s="mailto:"+n;else{let t;do t=e[0],e[0]=this.rules.inline._backpedal.exec(e[0])?.[0]??"";while(t!==e[0]);n=e[0],e[1]==="www."?s="http://"+e[0]:s=e[0]}return{type:"link",raw:e[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(r){let e=this.rules.inline.text.exec(r);if(e){let n=this.lexer.state.inRawBlock;return{type:"text",raw:e[0],text:e[0],escaped:n}}}},y=class B{tokens;options;state;inlineQueue;tokenizer;constructor(e){this.tokens=[],this.tokens.links=Object.create(null),this.options=e||S,this.options.tokenizer=this.options.tokenizer||new L,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let n={other:b,block:$.normal,inline:T.normal};this.options.pedantic?(n.block=$.pedantic,n.inline=T.pedantic):this.options.gfm&&(n.block=$.gfm,this.options.breaks?n.inline=T.breaks:n.inline=T.gfm),this.tokenizer.rules=n}static get rules(){return{block:$,inline:T}}static lex(e,n){return new B(n).lex(e)}static lexInline(e,n){return new B(n).inlineTokens(e)}lex(e){e=e.replace(b.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let n=0;n<this.inlineQueue.length;n++){let s=this.inlineQueue[n];this.inlineTokens(s.src,s.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,n=[],s=!1){for(this.options.pedantic&&(e=e.replace(b.tabCharGlobal,"    ").replace(b.spaceLine,""));e;){let t;if(this.options.extensions?.block?.some(a=>(t=a.call({lexer:this},e,n))?(e=e.substring(t.raw.length),n.push(t),!0):!1))continue;if(t=this.tokenizer.space(e)){e=e.substring(t.raw.length);let a=n.at(-1);t.raw.length===1&&a!==void 0?a.raw+=`
`:n.push(t);continue}if(t=this.tokenizer.code(e)){e=e.substring(t.raw.length);let a=n.at(-1);a?.type==="paragraph"||a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+t.raw,a.text+=`
`+t.text,this.inlineQueue.at(-1).src=a.text):n.push(t);continue}if(t=this.tokenizer.fences(e)){e=e.substring(t.raw.length),n.push(t);continue}if(t=this.tokenizer.heading(e)){e=e.substring(t.raw.length),n.push(t);continue}if(t=this.tokenizer.hr(e)){e=e.substring(t.raw.length),n.push(t);continue}if(t=this.tokenizer.blockquote(e)){e=e.substring(t.raw.length),n.push(t);continue}if(t=this.tokenizer.list(e)){e=e.substring(t.raw.length),n.push(t);continue}if(t=this.tokenizer.html(e)){e=e.substring(t.raw.length),n.push(t);continue}if(t=this.tokenizer.def(e)){e=e.substring(t.raw.length);let a=n.at(-1);a?.type==="paragraph"||a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+t.raw,a.text+=`
`+t.raw,this.inlineQueue.at(-1).src=a.text):this.tokens.links[t.tag]||(this.tokens.links[t.tag]={href:t.href,title:t.title},n.push(t));continue}if(t=this.tokenizer.table(e)){e=e.substring(t.raw.length),n.push(t);continue}if(t=this.tokenizer.lheading(e)){e=e.substring(t.raw.length),n.push(t);continue}let i=e;if(this.options.extensions?.startBlock){let a=1/0,o=e.slice(1),l;this.options.extensions.startBlock.forEach(h=>{l=h.call({lexer:this},o),typeof l=="number"&&l>=0&&(a=Math.min(a,l))}),a<1/0&&a>=0&&(i=e.substring(0,a+1))}if(this.state.top&&(t=this.tokenizer.paragraph(i))){let a=n.at(-1);s&&a?.type==="paragraph"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+t.raw,a.text+=`
`+t.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):n.push(t),s=i.length!==e.length,e=e.substring(t.raw.length);continue}if(t=this.tokenizer.text(e)){e=e.substring(t.raw.length);let a=n.at(-1);a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+t.raw,a.text+=`
`+t.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):n.push(t);continue}if(e){let a="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(a);break}else throw new Error(a)}}return this.state.top=!0,n}inline(e,n=[]){return this.inlineQueue.push({src:e,tokens:n}),n}inlineTokens(e,n=[]){let s=e,t=null;if(this.tokens.links){let l=Object.keys(this.tokens.links);if(l.length>0)for(;(t=this.tokenizer.rules.inline.reflinkSearch.exec(s))!=null;)l.includes(t[0].slice(t[0].lastIndexOf("[")+1,-1))&&(s=s.slice(0,t.index)+"["+"a".repeat(t[0].length-2)+"]"+s.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(t=this.tokenizer.rules.inline.anyPunctuation.exec(s))!=null;)s=s.slice(0,t.index)+"++"+s.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let i;for(;(t=this.tokenizer.rules.inline.blockSkip.exec(s))!=null;)i=t[2]?t[2].length:0,s=s.slice(0,t.index+i)+"["+"a".repeat(t[0].length-i-2)+"]"+s.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);s=this.options.hooks?.emStrongMask?.call({lexer:this},s)??s;let a=!1,o="";for(;e;){a||(o=""),a=!1;let l;if(this.options.extensions?.inline?.some(c=>(l=c.call({lexer:this},e,n))?(e=e.substring(l.raw.length),n.push(l),!0):!1))continue;if(l=this.tokenizer.escape(e)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.tag(e)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.link(e)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(l.raw.length);let c=n.at(-1);l.type==="text"&&c?.type==="text"?(c.raw+=l.raw,c.text+=l.text):n.push(l);continue}if(l=this.tokenizer.emStrong(e,s,o)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.codespan(e)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.br(e)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.del(e)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.autolink(e)){e=e.substring(l.raw.length),n.push(l);continue}if(!this.state.inLink&&(l=this.tokenizer.url(e))){e=e.substring(l.raw.length),n.push(l);continue}let h=e;if(this.options.extensions?.startInline){let c=1/0,d=e.slice(1),u;this.options.extensions.startInline.forEach(m=>{u=m.call({lexer:this},d),typeof u=="number"&&u>=0&&(c=Math.min(c,u))}),c<1/0&&c>=0&&(h=e.substring(0,c+1))}if(l=this.tokenizer.inlineText(h)){e=e.substring(l.raw.length),l.raw.slice(-1)!=="_"&&(o=l.raw.slice(-1)),a=!0;let c=n.at(-1);c?.type==="text"?(c.raw+=l.raw,c.text+=l.text):n.push(l);continue}if(e){let c="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(c);break}else throw new Error(c)}}return n}},M=class{options;parser;constructor(r){this.options=r||S}space(r){return""}code({text:r,lang:e,escaped:n}){let s=(e||"").match(b.notSpaceStart)?.[0],t=r.replace(b.endingNewline,"")+`
`;return s?'<pre><code class="language-'+x(s)+'">'+(n?t:x(t,!0))+`</code></pre>
`:"<pre><code>"+(n?t:x(t,!0))+`</code></pre>
`}blockquote({tokens:r}){return`<blockquote>
${this.parser.parse(r)}</blockquote>
`}html({text:r}){return r}def(r){return""}heading({tokens:r,depth:e}){return`<h${e}>${this.parser.parseInline(r)}</h${e}>
`}hr(r){return`<hr>
`}list(r){let e=r.ordered,n=r.start,s="";for(let a=0;a<r.items.length;a++){let o=r.items[a];s+=this.listitem(o)}let t=e?"ol":"ul",i=e&&n!==1?' start="'+n+'"':"";return"<"+t+i+`>
`+s+"</"+t+`>
`}listitem(r){return`<li>${this.parser.parse(r.tokens)}</li>
`}checkbox({checked:r}){return"<input "+(r?'checked="" ':"")+'disabled="" type="checkbox"> '}paragraph({tokens:r}){return`<p>${this.parser.parseInline(r)}</p>
`}table(r){let e="",n="";for(let t=0;t<r.header.length;t++)n+=this.tablecell(r.header[t]);e+=this.tablerow({text:n});let s="";for(let t=0;t<r.rows.length;t++){let i=r.rows[t];n="";for(let a=0;a<i.length;a++)n+=this.tablecell(i[a]);s+=this.tablerow({text:n})}return s&&(s=`<tbody>${s}</tbody>`),`<table>
<thead>
`+e+`</thead>
`+s+`</table>
`}tablerow({text:r}){return`<tr>
${r}</tr>
`}tablecell(r){let e=this.parser.parseInline(r.tokens),n=r.header?"th":"td";return(r.align?`<${n} align="${r.align}">`:`<${n}>`)+e+`</${n}>
`}strong({tokens:r}){return`<strong>${this.parser.parseInline(r)}</strong>`}em({tokens:r}){return`<em>${this.parser.parseInline(r)}</em>`}codespan({text:r}){return`<code>${x(r,!0)}</code>`}br(r){return"<br>"}del({tokens:r}){return`<del>${this.parser.parseInline(r)}</del>`}link({href:r,title:e,tokens:n}){let s=this.parser.parseInline(n),t=re(r);if(t===null)return s;r=t;let i='<a href="'+r+'"';return e&&(i+=' title="'+x(e)+'"'),i+=">"+s+"</a>",i}image({href:r,title:e,text:n,tokens:s}){s&&(n=this.parser.parseInline(s,this.parser.textRenderer));let t=re(r);if(t===null)return x(n);r=t;let i=`<img src="${r}" alt="${n}"`;return e&&(i+=` title="${x(e)}"`),i+=">",i}text(r){return"tokens"in r&&r.tokens?this.parser.parseInline(r.tokens):"escaped"in r&&r.escaped?r.text:x(r.text)}},X=class{strong({text:r}){return r}em({text:r}){return r}codespan({text:r}){return r}del({text:r}){return r}html({text:r}){return r}text({text:r}){return r}link({text:r}){return""+r}image({text:r}){return""+r}br(){return""}checkbox({raw:r}){return r}},w=class V{options;renderer;textRenderer;constructor(e){this.options=e||S,this.options.renderer=this.options.renderer||new M,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new X}static parse(e,n){return new V(n).parse(e)}static parseInline(e,n){return new V(n).parseInline(e)}parse(e){let n="";for(let s=0;s<e.length;s++){let t=e[s];if(this.options.extensions?.renderers?.[t.type]){let a=t,o=this.options.extensions.renderers[a.type].call({parser:this},a);if(o!==!1||!["space","hr","heading","code","table","blockquote","list","html","def","paragraph","text"].includes(a.type)){n+=o||"";continue}}let i=t;switch(i.type){case"space":{n+=this.renderer.space(i);break}case"hr":{n+=this.renderer.hr(i);break}case"heading":{n+=this.renderer.heading(i);break}case"code":{n+=this.renderer.code(i);break}case"table":{n+=this.renderer.table(i);break}case"blockquote":{n+=this.renderer.blockquote(i);break}case"list":{n+=this.renderer.list(i);break}case"checkbox":{n+=this.renderer.checkbox(i);break}case"html":{n+=this.renderer.html(i);break}case"def":{n+=this.renderer.def(i);break}case"paragraph":{n+=this.renderer.paragraph(i);break}case"text":{n+=this.renderer.text(i);break}default:{let a='Token with "'+i.type+'" type was not found.';if(this.options.silent)return console.error(a),"";throw new Error(a)}}}return n}parseInline(e,n=this.renderer){let s="";for(let t=0;t<e.length;t++){let i=e[t];if(this.options.extensions?.renderers?.[i.type]){let o=this.options.extensions.renderers[i.type].call({parser:this},i);if(o!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(i.type)){s+=o||"";continue}}let a=i;switch(a.type){case"escape":{s+=n.text(a);break}case"html":{s+=n.html(a);break}case"link":{s+=n.link(a);break}case"image":{s+=n.image(a);break}case"checkbox":{s+=n.checkbox(a);break}case"strong":{s+=n.strong(a);break}case"em":{s+=n.em(a);break}case"codespan":{s+=n.codespan(a);break}case"br":{s+=n.br(a);break}case"del":{s+=n.del(a);break}case"text":{s+=n.text(a);break}default:{let o='Token with "'+a.type+'" type was not found.';if(this.options.silent)return console.error(o),"";throw new Error(o)}}}return s}},A=class{options;block;constructor(r){this.options=r||S}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens","emStrongMask"]);static passThroughHooksRespectAsync=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(r){return r}postprocess(r){return r}processAllTokens(r){return r}emStrongMask(r){return r}provideLexer(){return this.block?y.lex:y.lexInline}provideParser(){return this.block?w.parse:w.parseInline}},rt=class{defaults=O();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=w;Renderer=M;TextRenderer=X;Lexer=y;Tokenizer=L;Hooks=A;constructor(...r){this.use(...r)}walkTokens(r,e){let n=[];for(let s of r)switch(n=n.concat(e.call(this,s)),s.type){case"table":{let t=s;for(let i of t.header)n=n.concat(this.walkTokens(i.tokens,e));for(let i of t.rows)for(let a of i)n=n.concat(this.walkTokens(a.tokens,e));break}case"list":{let t=s;n=n.concat(this.walkTokens(t.items,e));break}default:{let t=s;this.defaults.extensions?.childTokens?.[t.type]?this.defaults.extensions.childTokens[t.type].forEach(i=>{let a=t[i].flat(1/0);n=n.concat(this.walkTokens(a,e))}):t.tokens&&(n=n.concat(this.walkTokens(t.tokens,e)))}}return n}use(...r){let e=this.defaults.extensions||{renderers:{},childTokens:{}};return r.forEach(n=>{let s={...n};if(s.async=this.defaults.async||s.async||!1,n.extensions&&(n.extensions.forEach(t=>{if(!t.name)throw new Error("extension name required");if("renderer"in t){let i=e.renderers[t.name];i?e.renderers[t.name]=function(...a){let o=t.renderer.apply(this,a);return o===!1&&(o=i.apply(this,a)),o}:e.renderers[t.name]=t.renderer}if("tokenizer"in t){if(!t.level||t.level!=="block"&&t.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let i=e[t.level];i?i.unshift(t.tokenizer):e[t.level]=[t.tokenizer],t.start&&(t.level==="block"?e.startBlock?e.startBlock.push(t.start):e.startBlock=[t.start]:t.level==="inline"&&(e.startInline?e.startInline.push(t.start):e.startInline=[t.start]))}"childTokens"in t&&t.childTokens&&(e.childTokens[t.name]=t.childTokens)}),s.extensions=e),n.renderer){let t=this.defaults.renderer||new M(this.defaults);for(let i in n.renderer){if(!(i in t))throw new Error(`renderer '${i}' does not exist`);if(["options","parser"].includes(i))continue;let a=i,o=n.renderer[a],l=t[a];t[a]=(...h)=>{let c=o.apply(t,h);return c===!1&&(c=l.apply(t,h)),c||""}}s.renderer=t}if(n.tokenizer){let t=this.defaults.tokenizer||new L(this.defaults);for(let i in n.tokenizer){if(!(i in t))throw new Error(`tokenizer '${i}' does not exist`);if(["options","rules","lexer"].includes(i))continue;let a=i,o=n.tokenizer[a],l=t[a];t[a]=(...h)=>{let c=o.apply(t,h);return c===!1&&(c=l.apply(t,h)),c}}s.tokenizer=t}if(n.hooks){let t=this.defaults.hooks||new A;for(let i in n.hooks){if(!(i in t))throw new Error(`hook '${i}' does not exist`);if(["options","block"].includes(i))continue;let a=i,o=n.hooks[a],l=t[a];A.passThroughHooks.has(i)?t[a]=h=>{if(this.defaults.async&&A.passThroughHooksRespectAsync.has(i))return(async()=>{let d=await o.call(t,h);return l.call(t,d)})();let c=o.call(t,h);return l.call(t,c)}:t[a]=(...h)=>{if(this.defaults.async)return(async()=>{let d=await o.apply(t,h);return d===!1&&(d=await l.apply(t,h)),d})();let c=o.apply(t,h);return c===!1&&(c=l.apply(t,h)),c}}s.hooks=t}if(n.walkTokens){let t=this.defaults.walkTokens,i=n.walkTokens;s.walkTokens=function(a){let o=[];return o.push(i.call(this,a)),t&&(o=o.concat(t.call(this,a))),o}}this.defaults={...this.defaults,...s}}),this}setOptions(r){return this.defaults={...this.defaults,...r},this}lexer(r,e){return y.lex(r,e??this.defaults)}parser(r,e){return w.parse(r,e??this.defaults)}parseMarkdown(r){return(e,n)=>{let s={...n},t={...this.defaults,...s},i=this.onError(!!t.silent,!!t.async);if(this.defaults.async===!0&&s.async===!1)return i(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof e>"u"||e===null)return i(new Error("marked(): input parameter is undefined or null"));if(typeof e!="string")return i(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(e)+", string expected"));if(t.hooks&&(t.hooks.options=t,t.hooks.block=r),t.async)return(async()=>{let a=t.hooks?await t.hooks.preprocess(e):e,o=await(t.hooks?await t.hooks.provideLexer():r?y.lex:y.lexInline)(a,t),l=t.hooks?await t.hooks.processAllTokens(o):o;t.walkTokens&&await Promise.all(this.walkTokens(l,t.walkTokens));let h=await(t.hooks?await t.hooks.provideParser():r?w.parse:w.parseInline)(l,t);return t.hooks?await t.hooks.postprocess(h):h})().catch(i);try{t.hooks&&(e=t.hooks.preprocess(e));let a=(t.hooks?t.hooks.provideLexer():r?y.lex:y.lexInline)(e,t);t.hooks&&(a=t.hooks.processAllTokens(a)),t.walkTokens&&this.walkTokens(a,t.walkTokens);let o=(t.hooks?t.hooks.provideParser():r?w.parse:w.parseInline)(a,t);return t.hooks&&(o=t.hooks.postprocess(o)),o}catch(a){return i(a)}}}onError(r,e){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,r){let s="<p>An error occurred:</p><pre>"+x(n.message+"",!0)+"</pre>";return e?Promise.resolve(s):s}if(e)return Promise.reject(n);throw n}}},_=new rt;function g(r,e){return _.parse(r,e)}g.options=g.setOptions=function(r){return _.setOptions(r),g.defaults=_.defaults,le(g.defaults),g};g.getDefaults=O;g.defaults=S;g.use=function(...r){return _.use(...r),g.defaults=_.defaults,le(g.defaults),g};g.walkTokens=function(r,e){return _.walkTokens(r,e)};g.parseInline=_.parseInline;g.Parser=w;g.parser=w.parse;g.Renderer=M;g.TextRenderer=X;g.Lexer=y;g.lexer=y.lex;g.Tokenizer=L;g.Hooks=A;g.parse=g;g.options;g.setOptions;g.use;g.walkTokens;g.parseInline;w.parse;y.lex;export{St as A,_t as B,xt as C,wt as D,yt as E,kt as F,bt as G,mt as H,ft as I,dt as J,gt as K,g as L,ut as M,pt as N,ht as O,ct as P,ot as Q,lt as R,at as S,it as T,Zt as _,Ft as a,Nt as b,Gt as c,Wt as d,Ut as e,Ht as f,Ot as g,Vt as h,Bt as i,qt as j,Et as k,It as l,zt as m,Dt as n,Mt as o,ye as p,Lt as q,Ct as r,$t as s,st as t,Pt as u,jt as v,At as w,Rt as x,Tt as y,vt as z};
