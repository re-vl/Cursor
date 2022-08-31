function followingDotCursor(options, set) {
   let hasWrapperEl = options && options.element;
   let element = hasWrapperEl || document.body;

   let width = window.innerWidth;
   let height = window.innerHeight;
   let cursor = { x: width / 2, y: width / 2 };
   let dot = new Dot(width / 2, height / 2, set.widthOut, set.heightOut);
   let dotInner = new Dot(width / 2, height / 2, set.widthIn, set.heightIn);
   let canvas,
      context,
      elemActive = 0;
   var over = 0;
   const anhors = document.querySelectorAll("[href], button, [onclick], [type='submit']");

   function init() {
      document.body.style.cursor = "none";
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

      bindEvents();
      loop();
   }

   // Bind events that are needed
   function bindEvents() {
      element.addEventListener("mousemove", onMouseMove);
      window.addEventListener("resize", onWindowResize);
      //Перебор ссылок опеделяем наведение
      anhors.forEach((item) => {
         item.addEventListener("mouseover", () => {
            over = 1;
         });
         item.addEventListener("mouseout", () => {
            over = 0;
         });
      });
      //Проверяем открытие в elementor, отключаем курсор
      let observer = new MutationObserver(() => {
         if (document.body.classList.contains("elementor-editor-active")) {
            canvas.style.display = "none";
            document.body.style.cursor = "auto";
            elemActive = 1;
         }
      });
      observer.observe(document.body, { attributeFilter: ["class"] });
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
      resolutionOff();
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
         context.lineWidth = 1;
         context.arc(this.position.x, this.position.y, this.width, 0, 2 * Math.PI);
         //Задаем цвет внешнего круга
         if (filled == "stroke") {
            //Проверяем навидение на элемент, меняем цвет
            if (over) {
               context.strokeStyle = set.colorOutHover;
            } else {
               context.strokeStyle = set.colorOut;
            }
            context.stroke();
         }
         //Задаем цвет центральной точки
         if (filled == "fill") {
            //Проверяем навидение на элемент, меняем цвет
            if (over) {
               context.fillStyle = set.colorInHover;
            } else {
               context.fillStyle = set.colorIn;
            }
            context.fill();
         }

         context.closePath();
      };
   }

   //Отключение на устройствах с меньшим разрешением
   function resolutionOff() {
      if (window.screen.width < set.resolutionOff && !elemActive) {
         canvas.style.display = "none";
         document.body.style.cursor = "auto";
      } else if (window.screen.width >= set.resolutionOff && !elemActive) {
         canvas.style.display = "block";
         document.body.style.cursor = "none";
      }
   }
   init();
   resolutionOff();
}
followingDotCursor(0, {
   //внешний круг
   widthOut: 20,
   heightOut: 20,
   colorOut: "rgba(50, 50, 50, 0.8)",
   colorOutHover: "rgba(250, 0, 0, 1)",
   //внутренний круг
   widthIn: 3,
   heightIn: 3,
   colorIn: "rgba(50, 50, 50, 0.8)",
   colorInHover: "rgba(250, 0, 0, 1)",
   //разрешение экрана для отключения
   resolutionOff: 1367,
});
