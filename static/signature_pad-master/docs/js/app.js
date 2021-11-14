let wrapper = document.getElementById("signature-pad");
let clearButton = wrapper.querySelector("[data-action=clear]");
let saveButton = wrapper.querySelector("[data-action=save]");
let canvas = wrapper.querySelector("canvas");
let signatureContainer = document.querySelector('#signature');
let signatureButton = document.querySelector('#signatureButton');
let type = window.location.href;
let signaturePad = new SignaturePad(canvas, {
  backgroundColor: 'rgb(255, 255, 255)'
});

function toStringFormatData(date) {
  let day = date.getDate();
  let month = date.getMonth() + 1;
  if (day < 10) day = 0 + String(day);
  if (month < 10) month = 0 + String(month);
  return day + "." + (month) + "." + date.getFullYear();
}

window.onload = () => {
  let fixedInputDate = document.querySelectorAll('.point');
  fixedInputDate.forEach(e => {
    e.value = toStringFormatData(new Date());
  });
}

function resizeCanvas() {
  let ratio = Math.max(window.devicePixelRatio || 1, 1);
  canvas.width = canvas.offsetWidth * ratio;
  canvas.height = canvas.offsetHeight * ratio;
  canvas.getContext("2d").scale(ratio, ratio);
  signaturePad.clear();
}

window.onresize = resizeCanvas;
resizeCanvas();


clearButton.addEventListener("click", function (event) {
  signaturePad.clear();
});

saveButton.addEventListener('click', () => {
  type = type.split('/');
  type = type[type.length - 1];
  if (!signaturePad.isEmpty()) {
    let data = signaturePad.toDataURL();
    wrapper.classList.remove('show');

    signatureContainer.insertAdjacentHTML("beforeend", `<img id="sing_img" src="${data}" alt="">`);
    let obj = {};
    obj['signature'] = data;

    document.querySelectorAll('[name]').forEach((e) => {
      let key = e.getAttribute('name');
      obj[key] = e.value;
    });
    console.log(type)
    fetch(`/statement/${type}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(obj),
    })
      .then(r => {
        if(r.status === 500){
          alert("Ошибка при отправке заявления, повторите попытку позже...");
          return;
        }
        alert("Заявление успешно отправлено");
      })
      .catch(e => {
        alert("Ошибка при отправке заявления, повторите попытку позже...");
      });
  } else {
    alert("Подпись не может быть пустой!")
  }
});

signatureButton.addEventListener('click', () => {
  wrapper.classList.add('show');
  resizeCanvas();
})








