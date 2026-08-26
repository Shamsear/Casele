/**
 * Signature luxury fly-to-cart animation
 * Spawns a floating clone of the phone case that flies gracefully into the cart icon,
 * pulses the cart badge, and then slides open the cart drawer.
 */

export function flyToCart(
  imageSrc: string,
  sourceElement?: HTMLElement | null,
  onComplete?: () => void
) {
  if (typeof window === "undefined") {
    onComplete?.();
    return;
  }

  // 1. Locate Cart Target in Desktop or Mobile header
  let cartTarget = document.querySelector(".cart-target-bubble") as HTMLElement | null;
  if (!cartTarget) {
    cartTarget = document.getElementById("cart-bubble-target");
  }

  // 2. Compute starting rect
  let startX = window.innerWidth / 2 - 75;
  let startY = window.innerHeight / 2 - 120;
  let startWidth = 150;
  let startHeight = 220;

  if (sourceElement) {
    const rect = sourceElement.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      startX = rect.left + rect.width / 2 - 75;
      startY = rect.top + rect.height / 2 - 110;
      startWidth = Math.min(rect.width * 0.75, 180);
      startHeight = Math.min(rect.height * 0.75, 260);
    }
  }

  // 3. Compute target rect (Cart Icon)
  let targetX = window.innerWidth - 70;
  let targetY = 20;

  if (cartTarget) {
    const targetRect = cartTarget.getBoundingClientRect();
    targetX = targetRect.left + targetRect.width / 2 - 20;
    targetY = targetRect.top + targetRect.height / 2 - 25;
  }

  // 4. Create floating animated case clone
  const flyingImg = document.createElement("img");
  flyingImg.src = imageSrc;
  flyingImg.alt = "Adding to bag";
  flyingImg.style.position = "fixed";
  flyingImg.style.left = `${startX}px`;
  flyingImg.style.top = `${startY}px`;
  flyingImg.style.width = `${startWidth}px`;
  flyingImg.style.height = `${startHeight}px`;
  flyingImg.style.objectFit = "contain";
  flyingImg.style.zIndex = "99999";
  flyingImg.style.pointerEvents = "none";
  flyingImg.style.borderRadius = "24px";
  flyingImg.style.filter = "drop-shadow(0 20px 30px rgba(0,0,0,0.35))";
  flyingImg.style.transition = "all 0.65s cubic-bezier(0.19, 1, 0.22, 1)";
  flyingImg.style.transform = "scale(1) rotate(0deg)";
  flyingImg.style.opacity = "1";

  document.body.appendChild(flyingImg);

  // Trigger movement towards cart icon
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      flyingImg.style.left = `${targetX}px`;
      flyingImg.style.top = `${targetY}px`;
      flyingImg.style.width = "36px";
      flyingImg.style.height = "52px";
      flyingImg.style.transform = "scale(0.35) rotate(16deg)";
      flyingImg.style.opacity = "0.7";
    });
  });

  // Finish fly, pulse cart bubble, open drawer
  setTimeout(() => {
    if (flyingImg.parentNode) {
      flyingImg.parentNode.removeChild(flyingImg);
    }
    window.dispatchEvent(new CustomEvent("cart-bubble-bounce"));
    onComplete?.();
  }, 620);
}
