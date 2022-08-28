function followingDotCursor(options) {
   document.body.style.cursor = "none";
   let hasWrapperEl = options && options.element;
   let element = hasWrapperEl || document.body;

   let width = window.innerWidth;
   let height = window.innerHeight;
   let cursor = { x: width / 2, y: width / 2 };
   let dot = new Dot(width / 2, height / 2, 20, 20);
   let dotInner = new Dot(width / 2, height / 2, 3, 3);
   let canvas, context;
   var over = 0;
   const anhors = document.querySelectorAll("[href], button");

   function init() {
      canvas = document.createElement("canvas");
      context = canvas.getContext("2d");
      canvas.style.top = "0px";
      canvas.style.left = "0px";
      canvas.style.pointerEvents = "none";

      if (hasWrapperEl) {
         canvas.style.position = "absolute";
         element.appendChild(canvas);
         canvas.width = element.clientWidth;
         canvas.height = element.clientHeight;
      } else {
         canvas.style.position = "fixed";
         document.body.appendChild(canvas);
         canvas.width = width;
         canvas.height = height;
      }

      anhors.forEach((item) => {
         item.addEventListener("mouseover", () => {
            over = 1;
         });
         item.addEventListener("mouseout", () => {
            over = 0;
         });
      });

      bindEvents();
      loop();
   }

   // Bind events that are needed
   function bindEvents() {
      element.addEventListener("mousemove", onMouseMove);
      window.addEventListener("resize", onWindowResize);
   }

   function onWindowResize() {
      width = window.innerWidth;
      height = window.innerHeight;

      if (hasWrapperEl) {
         canvas.width = element.clientWidth;
         canvas.height = element.clientHeight;
      } else {
         canvas.width = width;
         canvas.height = height;
      }
   }

   function onMouseMove(e) {
      if (hasWrapperEl) {
         const boundingRect = element.getBoundingClientRect();
         cursor.x = e.clientX - boundingRect.left;
         cursor.y = e.clientY - boundingRect.top;
      } else {
         cursor.x = e.clientX;
         cursor.y = e.clientY;
      }
   }

   function updateDot() {
      context.clearRect(0, 0, width, height);
      dot.moveTowards(cursor.x, cursor.y, context, "stroke");
      dotInner.moveTowards(cursor.x, cursor.y, context, "fill");
   }

   function loop() {
      updateDot();
      requestAnimationFrame(loop);
   }

   function Dot(x, y, width, lag) {
      this.position = { x: x, y: y };
      this.width = width;
      this.lag = lag;

      this.moveTowards = function (x, y, context, filled) {
         this.position.x += (x - this.position.x) / this.lag;
         this.position.y += (y - this.position.y) / this.lag;

         context.beginPath();
         context.lineWidth = 2;
         context.arc(this.position.x, this.position.y, this.width, 0, 2 * Math.PI);

         if (filled == "stroke") {
            if (over) {
               context.strokeStyle = "rgba(250, 0, 0, 0.8)";
            } else {
               context.strokeStyle = "rgba(50, 50, 50, 0.8)";
            }
            context.stroke();
         }
         if (filled == "fill") {
            context.fillStyle = "rgba(250, 0, 0, 0.8)";
            context.fill();
         }

         context.closePath();
      };
   }

   init();
}
followingDotCursor();
