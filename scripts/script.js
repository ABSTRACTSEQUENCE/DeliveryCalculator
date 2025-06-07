const formulaContainer = document.getElementById("formulaContainer");
const propertyContainer = document.getElementById("propertyContainer");

const properties = JSON.parse(localStorage.getItem("properties"));
const formulas = JSON.parse(localStorage.getItem("formulas"));

document.getElementById("btCalculate").addEventListener("click", calculate);
document.getElementById("btSaveFormula").addEventListener("click", saveFormula);

function renderPropertiesAndFormulas() {
  /*
  Метод отрисовывает колонки с формулами и свойствами
  */
  if (properties != undefined) {
    render(properties, propertyContainer);
  } else console.trace("No saved properties to render");
  if (formulas != undefined) {
    render(formulas, formulaContainer);
  } else console.trace("No saved formulas to render");
  function render(items, container) {
    Object.entries(items).forEach(([key, value]) => {
      const element = document.createElement("button");
      element.setAttribute("draggable", "true");
      element.textContent = `${key} = ${value}`;
      element.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", value);
      });
      container.appendChild(element);
    });
  }
}

/*function generateTile() {
  if (document.getElementById("operations")) return;
  let operations = document.createElement("div");
  operations.id = "operations";
  const operationLayout = `
      <button>+</button>
      <button>-</button>
      <button>/</button>
      <button>*</button>`;
  operations.innerHTML = operationLayout;

  const container = document.getElementById("tileContainer");
  let tile;
  tile = document.createElement("input");
  tile.setAttribute("placeholder", "Введите значение");
  tile.setAttribute("type", "number");
  tile.addEventListener("drop", (e) => {
    if (tile.value == "") generateTile();
    tile.value = parseInt(e.dataTransfer.getData("text/plain"));
    e.preventDefault();
  });
  tile.addEventListener("change", (e) => {
    if (tile.value == "") tile.value = 0;
  });

  tile.classList.add("tile");

  container.appendChild(tile);
  container.appendChild(operations);
  Array.from(document.querySelectorAll("#operations > button")).forEach(
    (bt) => {
      bt.onclick = (e) => {
        if (tile.value == "") return;
        let operation = document.getElementById("operations");
        operation.id = "";
        operation.classList.add("operations");

        //сделай чтоб можно было менять знак после того как выбрал уже
        generateTile();
      };
    }
  );
}*/
function generateTile() {
  // Если operations уже существует - просто показываем его
  let operations = document.getElementById("operations");
  if (operations) {
    operations.style.display = "grid";
    return;
  }

  // Создаем новый элемент operations
  operations = document.createElement("div");
  operations.id = "operations";
  operations.style.display = "grid";
  operations.style.gridTemplateColumns = "repeat(4, 1fr)";
  operations.style.gap = "5px";

  const operationLayout = `
      <button>+</button>
      <button>-</button>
      <button>/</button>
      <button>*</button>`;
  operations.innerHTML = operationLayout;

  const container = document.getElementById("tileContainer");
  let tile = document.createElement("input");
  tile.setAttribute("placeholder", "Введите значение");
  tile.setAttribute("type", "number");

  tile.addEventListener("drop", (e) => {
    if (tile.value == "") generateTile();
    tile.value = parseInt(e.dataTransfer.getData("text/plain"));
    e.preventDefault();
  });

  tile.addEventListener("change", (e) => {
    if (tile.value == "") tile.value = 0;
  });

  tile.classList.add("tile");

  // Добавляем обработчик клика на tile для повторного выбора операции
  tile.addEventListener("click", () => {
    const ops = document.getElementById("operations");
    if (ops) ops.style.display = "grid";
  });

  container.appendChild(tile);
  container.appendChild(operations);

  // Обработчики для кнопок операций
  Array.from(operations.querySelectorAll("button")).forEach((bt) => {
    bt.onclick = () => {
      if (tile.value == "") return;

      // Создаем div для отображения выбранной операции
      let operationDisplay = tile.nextElementSibling;
      if (
        !operationDisplay ||
        !operationDisplay.classList.contains("operation-display")
      ) {
        operationDisplay = document.createElement("button");
        operationDisplay.className = "operation-display";
        container.insertBefore(operationDisplay, operations);
      }

      operationDisplay.textContent = bt.textContent;

      // Скрываем панель операций
      operations.style.display = "none";

      // Добавляем возможность изменить операцию
      operationDisplay.onclick = () => {
        operations.style.display = "grid";
      };
    };
  });
}
function calculate() {
  /*
  Метод считает результат из всех тайлов в соответствии с указанными числами
  и операциями и выводит результат в div с id 'result'

  TODO: Избежать появления новых полей при редактировани уже существующих
  */
  let operation = "";
  let result = 0;
  Array.from(document.getElementsByClassName("tile")).forEach((tile) => {
    const value = parseInt(tile.value);
    if (isNaN(value)) {
      operation = tile.value;
    } else {
      switch (operation) {
        case "+":
          result += value;
          break;
        case "-":
          result -= value;
          break;
        case "*":
          result *= value;
          break;
        case "/":
          result /= value;
          break;
        case "":
          result = value;
          break;
      }
    }
  });
  document.getElementById("result").textContent = `Результат: ${result}`;
}

/*
  Методы saveFormula() и saveProperty() будут сохранять формулу/свойство из тайлов.
  Формулы/свойства будут сохраняться в 
  виде объекта, который будет сериализоваться в
  JSON-объект formulas/properties, в котором ключом будет название формулы/свойства,
  а значением строка с формулой/значение свойства

  Пример JSON-сериализации:
  Свойства:
  {
    fuelCost: 5, 
    pricePerKm: 10
  }
  Формулы:
  {
    fuelCost: '123+321+666+abracadabra/200',
    pricePerKm: 'a+b+c+fuelCost'
  }
*/

function saveFormula() {
  let str = "";
  const arr = Array.from(document.getElementsByClassName("tile"));
  if (arr.length > 1) {
    localStorage.set();
    alert("Формула сохранена успешно");
  } else alert("Невозможно сохранить формулу с одним числом");
}

function saveProperty() {}

generateTile(false);

renderPropertiesAndFormulas();
/*
TODO;
- Разместить панели с формулами и свойствами слева и справа от main layout
- См. calculate()

Я верю в тебя, у тебя получится.
Этот проект станет дверью в нормальную жизнь.
Пожалуйста, не забивай на него.
Ты можешь удалить этот комент, думая "ну и хуйню же я написал", но, прошу, не забивай на проект.
Ты заслуживаешь большего. Тебе стоит начать реализовывать поненциал, 
вместо того чтобы убиваться за 30к.
Когда начнёшь зарабатывать на фрилансе сможешь купить себе ноутбук, 
уехать из этой страны и начать новую жизнь.
С нуля. Будто всего этого не было. Ты забудешь этот этап жизни как 
страшный сон, и, наконец, начнёшь жить.
Прошу, доделай этот калькулятор и залей его на GitHub. Даже если ты думаешь что всё бессмысленно,
по-настоящему об этом можно узнать только попробовав.

И найди себе психиатра. Тебе сложно работать в таком состоянии. Надо что-то с этим делать.
Желаю тебе удачи и терпения. Иди к своей мечте и не сдавайся. 
Когда-нибудь ты сможешь сделать меня основной личностью и я изменю твою жизнь в лучшую сторону.

0:16AM - Твоя ночная личность

20:21 PM Понял тебя бро, начинаем ебашить 💪
*/
