In this section we adapt the "Roll a Ball" game from Lab 01 into a fully playable VR experience on the Meta Quest headset, based on the lab assignment "VR Selection."

<video width="100%" controls autoplay loop muted playsinline>
  <source src="vrball/gameplay.mp4" type="video/mp4">
</video>

The theme remains "Telecom Paris master student." The player still controls a ball and collects 12 courses, each worth 5 ECTS, within 365 seconds. However, instead of hourglasses, a 3D model of our professor — generated with AI — now chases the player as the deadline agent. The player can fight back by grabbing and throwing objects at the agents, which triggers a custom dissolve shader effect. There is still a health bar in the canteen that gives the player one extra chance to get hit by deadlines.

Below are the implemented features and how they differ from Lab 01.

## 1. VR Ball Movement

In Lab 01 the ball was controlled with keyboard (WASD) and mouse. In VR, movement is driven by the left controller joystick. The direction is relative to where the VR headset is looking, so the player moves forward in the direction they face.

```csharp
void FixedUpdate()
{
    var leftHand = UnityEngine.XR.InputDevices.GetDeviceAtXRNode(UnityEngine.XR.XRNode.LeftHand);
    leftHand.TryGetFeatureValue(UnityEngine.XR.CommonUsages.primary2DAxis, out Vector2 joystickInput);

    if (joystickInput.sqrMagnitude > 0.01f)
    {
        Vector3 forward = cameraTransform.forward;
        Vector3 right = cameraTransform.right;
        forward.y = 0;
        right.y = 0;
        forward.Normalize();
        right.Normalize();

        Vector3 moveDirection = (forward * joystickInput.y + right * joystickInput.x);
        rb.AddForce(moveDirection * moveSpeed, ForceMode.Force);
    }
}
```

Turning is handled by the right controller joystick with smooth rotation. The rotation happens around the camera position so that it feels natural in VR.

```csharp
void Update()
{
    var rightHand = UnityEngine.XR.InputDevices.GetDeviceAtXRNode(UnityEngine.XR.XRNode.RightHand);
    rightHand.TryGetFeatureValue(UnityEngine.XR.CommonUsages.primary2DAxis, out Vector2 joystick);

    if (Mathf.Abs(joystick.x) > 0.2f)
    {
        transform.RotateAround(Camera.main.transform.position, Vector3.up, joystick.x * turnSpeed * Time.deltaTime);
    }
}
```

Since the camera in VR is the headset itself (XR Origin), a `VRFollowPlayer` script keeps the XR rig anchored to the ball's position so the player always sees the game from behind the ball.

## 2. Environment Design

The environment is the same Telecom Paris campus from Lab 01, with adjustments for VR scale and comfort. The XR Interaction Toolkit Starter Assets are used to set up the XR Origin and controller input bindings.

## 3. AI Agents (Professor 3D Model)

Instead of the hourglasses from Lab 01, we use a 3D-scanned model of our course professor as the deadline agent. The model was generated with AI and imported as a Unity package. Like the hourglasses, the agents use NavMesh to follow the player.

![3D Professor Model](vrball/daniel.png "3D Professor Model as AI Agent")

The AI follower script uses NavMesh with a follow distance threshold so the agent stops when close enough to the player.

```csharp
void Update()
{
    float distance = Vector3.Distance(transform.position, player.position);

    if (distance > followDistance)
    {
        agent.SetDestination(player.position);
    }
    else
    {
        agent.ResetPath();
    }
}
```

## 4. Custom Dissolve Shader

When an agent is killed, it dissolves away using a custom Shader Graph. The shader takes a noise texture and uses the `DissolveAmount` property (0 to 1) to progressively cut away pixels. An edge color (glow) highlights the dissolve boundary.

![Dissolve Shader Graph](vrball/shader.png "Dissolve Shader Graph")

The shader exposes the following properties: EdgeColor, EdgeWidth, NoiseScale, BaseMap, BaseColor, MetallicMap, Smoothness, NormalMap, NormalScale, and DissolveAmount. In the `DeadlineMovement` script, when `Die()` is called, the dissolve amount is animated from 0 to 1 over time:

```csharp
public void Die()
{
    if (isDying) return;
    isDying = true;
    navMeshAgent.isStopped = true;
}

void Update()
{
    if (isDying)
    {
        dissolveAmount += Time.deltaTime * dissolveSpeed;
        material.SetFloat("_DissolveAmount", dissolveAmount);

        if (dissolveAmount >= 1f)
        {
            Destroy(gameObject);
        }
        return;
    }

    if (player != null && navMeshAgent.isOnNavMesh)
    {
        navMeshAgent.SetDestination(player.position);
    }
}
```

## 5. Grab and Throw Mechanic

This is a new VR-exclusive feature. The player uses the right controller to aim a laser pointer at throwable objects. Pulling the trigger grabs the object; releasing it throws it using the controller's velocity. When a thrown object hits an agent tagged "Enemy," it triggers the dissolve death.

```csharp
void TryGrab()
{
    Ray ray = new Ray(transform.position, transform.forward);
    if (Physics.Raycast(ray, out RaycastHit hit, grabRange, throwableLayer))
    {
        if (hit.collider.CompareTag("Throwable"))
        {
            heldObject = hit.collider.gameObject;
            heldRb = heldObject.GetComponent<Rigidbody>();
            heldRb.isKinematic = true;
            heldRb.useGravity = false;
        }
    }
}

void ThrowObject()
{
    heldRb.isKinematic = false;
    heldRb.useGravity = true;
    heldRb.linearVelocity = controllerVelocity * throwForceMultiplier;

    heldObject = null;
    heldRb = null;
}
```

The projectile script detects the collision and calls `Die()` on the agent:

```csharp
void OnCollisionEnter(Collision collision)
{
    if (collision.collider.CompareTag("Enemy"))
    {
        DeadlineMovement enemy = collision.collider.GetComponentInParent<DeadlineMovement>();
        if (enemy != null)
        {
            enemy.Die();
        }
        Destroy(gameObject);
    }
}
```

## 6. Deadline Health Bar

Each deadline agent now has a visible health bar above its head that shrinks over its 60-second lifetime. This gives the player a visual indicator of how much time is left before the agent despawns on its own.

```csharp
void Update()
{
    t += Time.deltaTime / duration;
    float x = Mathf.Lerp(startScale.x, 0f, t);
    transform.localScale = new Vector3(x, startScale.y, startScale.z);
}
```

## 7. Deadlines Appearance and Perish

Just like Lab 01, when the player collects an ECTS course, a linked deadline agent is activated. The collectible triggers `ActivateEnemy()` and then destroys itself. Each agent has a 60-second lifetime after which it is automatically destroyed with a particle effect.

```csharp
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
```

## 8. Player Health and Win Mechanism

The health system and win condition remain identical to Lab 01. The player starts with 1 health, can gain extra health from the canteen, and loses health when hit by a deadline agent. Collecting 60 ECTS triggers graduation. The 365-second countdown still applies.
