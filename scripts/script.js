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

function generateTile(initialValue = "") {
  /*
  TODO:
  1) Добавить возможность удалить тайл
  */
  const container = document.getElementById("tileContainer");

  // Создаем input для числа
  const tile = document.createElement("input");
  tile.type = "number";
  tile.placeholder = "Введите значение";
  tile.value = initialValue;
  tile.classList.add("tile");

  // Обработчики для input
  tile.addEventListener("change", (e) => {
    if (tile.value === "") tile.value = 0;
  });

  container.appendChild(tile);

  // Генерируем кнопки операций только если нужно
  if (!document.getElementById("operations")) {
    const container = document.getElementById("tileContainer");
    const operations = document.createElement("div");
    operations.id = "operations";
    operations.innerHTML = `
    <button data-op="+">+</button>
    <button data-op="-">-</button>
    <button data-op="/">/</button>
    <button data-op="*">*</button>
  `;
    container.appendChild(operations);

    // Один обработчик для всех кнопок операций
    operations.addEventListener("click", (e) => {
      if (!e.target.matches("button")) return;
      const op = e.target.dataset.op;
      const prevTile = operations.previousElementSibling;

      if (prevTile.value === "") return;

      // Заменяем operations на кнопку с выбранной операцией
      const opButton = document.createElement("button");
      opButton.textContent = op;
      opButton.classList.add("selected-op");
      opButton.dataset.op = op;

      container.replaceChild(opButton, operations);
      // Обработчик для изменения операции
      opButton.addEventListener("click", () => {
        container.replaceChild(operations, opButton);
      });

      // Тут надо нормально обработать TypeError
      try {
        if (opButton.nextElementSibling.nextElementSibling == null) return;
      } catch {
        generateTile();
      }
    });
  }
}

function calculate(e) {
  /*
  Метод считает результат из всех тайлов в соответствии с указанными числами
  и операциями и выводит результат в div с id 'result'
  */
  const values = Array.from(document.getElementsByClassName("tile"));
  const operations = Array.from(document.getElementsByClassName("selected-op"));
  let result = 0;

  console.log(operations.includes("/"));
  operations.forEach((op) => {
    if (op.innerHTML == "*") {
      result = op.previousSibling.value * op.nextSibling.value;
    } else if (op.innerHTML == "/") {
      result = op.previousSibling.value / op.nextSibling.value;
    }
  });
  operations.forEach((op) => {
    if (op.innerHTML == "+") {
      result = op.previousSibling.value + op.nextSibling.value;
    } else if (op.innerHTML == "-") {
      result = op.previousSibling.value - op.nextSibling.value;
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

generateTile();

renderPropertiesAndFormulas();
