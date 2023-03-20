const bd = document.querySelector('body');
const mn = document.querySelector('main');
const tb = document.querySelector('#table');
const tbcenter = document.querySelector('#tbcenter');
const ingradminadd = document.querySelector('#ingradminadd');
const korgep = document.querySelector('#korgep');
const sousep = document.querySelector('#sousep');
const toppingp = document.querySelector('#toppingp');
const resetp = document.querySelector('#resetp');
resetp.style.cursor = 'pointer';
const compound = document.querySelector('#compaund');
const costanot = document.querySelector('#costanot');
const banner = document.querySelector('#banner');
const ban2 = document.querySelector('#ban2');
const sbmt = document.querySelector('input[type="submit"]')
const rst = document.querySelector('input[type="reset"]')
var downmouse = false;
var addingr;
var coord;
var switchingx;
var switchingy;
var korgsizeadded;
var souseadded;
var toppingadded = 0;
var addedingrarr = [];
var addedingrlist = [];
var costcount = 0;
const ingrlist = [{ name: 'Маленький корж', cost: '30', id: 'smallkorg', type: 'korg', size: '40', number: 0 },
{ name: 'Средний корж', cost: '40', id: 'midkorg', type: 'korg', size: '50', number: 1 },
{ name: 'Большой корж', cost: '50', id: 'bigkorg', type: 'korg', size: '60', number: 2 },
{ name: 'Кетчуп', cost: '10', id: 'ketchup', type: 'souse', number: 3 },
{ name: 'BBQ соус', cost: '10', id: 'bbq', type: 'souse', size: '', number: 4 },
{ name: 'Сливочный соус', cost: '10', id: 'slivochniy', type: 'souse', number: 5 },
{ name: 'Чеддер', cost: '20', id: 'chedder', type: 'topping', number: 6 },
{ name: 'Моцарела', cost: '20', id: 'mocarela', type: 'topping', number: 7 },
{ name: 'Пармезан', cost: '20', id: 'parmezan', type: 'topping', number: 8 },
{ name: 'Колбаски', cost: '25', id: 'kolbaski', type: 'topping', number: 9 },
{ name: 'Ветчина', cost: '27', id: 'vetchina', type: 'topping', number: 10 },
{ name: 'Курица', cost: '21', id: 'kurica', type: 'topping', number: 11 }];
var maxx = document.documentElement.clientWidth;
var maxy = document.documentElement.clientHeight;
const patternobj = {
    clientname: { pattern: /[A-Za-zА-Яа-я\s]{1,30}/i, antipattern: /[^A-Za-zА-Яа-я\s]/ },
    email: { pattern: /[\w_]{1,30}@[\w_]{1,10}\.[a-z]{2,4}/i },
    tel: { pattern: /\+*[\s(]*[\d]{0,4}[\s)(-]*[\d]{3}[\s)(-]*[\d]{3}[\s)(-]*[\d]{2}[\s)(-]*[\d]{2}/ },
    adress: { pattern: /[A-ZА-Я\s]+\d+/i },
};
function greenlight() {
    if (korgsizeadded) {
        korgep.style.backgroundColor = 'green';
    }
    else {
        korgep.style.backgroundColor = 'brown';
    }
    if (souseadded) {
        sousep.style.backgroundColor = 'green';
    }
    else {
        sousep.style.backgroundColor = 'brown';
    }
    if (toppingadded > 0) {
        toppingp.style.backgroundColor = 'green';
    }
    else {
        toppingp.style.backgroundColor = 'brown';
    }
    if (korgsizeadded && souseadded && toppingadded > 0) {
        return true;
    }
}
function reseting() {
    if (!canspin) {
        clearInterval(ruletTimeOut1);
        clearInterval(ruletTimeOut2);
        clearInterval(ruletTimeOut3);
        clearInterval(ruletTimeOut4);
        clearInterval(ruletTimeOut5);
        clearInterval(ruletTimeOutLight);
        clearInterval(ruletTimeOutAdd);
        if (mn.lastChild.tagName == 'IMG') {
            mn.removeChild(mn.lastChild);
        }
        document.querySelectorAll('.cell').forEach(function (a) {
            a.classList.remove('focusingridient');
            a.classList.remove('decideingridient');
        });
        ruletend();
    }
    while (tbcenter.firstChild) {
        tbcenter.removeChild(tbcenter.firstChild);
    }
    while (compound.firstChild) {
        compound.removeChild(compound.firstChild);
    }
    korgsizeadded = undefined;
    souseadded = undefined;
    toppingadded = 0;
    addedingrarr = [];
    addedingrlist = [];
    costcount = 0;
    document.querySelector('#cost').innerHTML = '';
    greenlight();
    localStorage.oldaddedingrlist = null;
}
function removeoneclick(targ) {
    targ.classList.remove('oneclick');
}
document.addEventListener('mousedown', function (e) {
    if (e.target.classList.contains('ingridient') && canspin) {
        let ingr = e.target;
        addingr = ingr.cloneNode(true);
        addingr.style.position = 'absolute';
        tbcenter.appendChild(addingr);
        if (e.target.classList.contains('oneclick')) {
            checkpossibadd(addingr, window.pageYOffset);
            addingr = undefined;
            greenlight();
        }
        else {
            downmouse = true;
            coord = ingr.getBoundingClientRect();
            switchingx = e.clientX - coord.x;
            switchingy = e.clientY - coord.y;
            addingr.style.left = coord.x + 'px';
            addingr.style.top = coord.y + (e.pageY - e.clientY) + 'px';
            addingr.style.zIndex = '5';
            e.preventDefault();
            e.target.classList.add('oneclick');
            setTimeout(removeoneclick, 1000, e.target);
        }
    }
    else {
        return;
    }
    document.addEventListener('mousemove', function (e) {
        if (downmouse) {
            addingr.style.left = e.clientX - switchingx + 'px';
            addingr.style.top = e.pageY - switchingy + 'px';
        }
        else {
            return;
        }
    });
});
document.addEventListener('mouseup', function (e) {
    if (downmouse) {
        downmouse = false;
        let coordtb = tb.getBoundingClientRect();
        let switchclik = window.pageYOffset;
        if (e.clientX > coordtb.left && e.clientX < coordtb.right && e.clientY > coordtb.top && e.clientY < coordtb.bottom) {
            checkpossibadd(addingr, switchclik);
        }
        else {
            tbcenter.removeChild(addingr);
        }
    }
    else {
        return;
    }
    addingr = undefined;
    switchingx = undefined;
    switchingy = undefined;
    coord = undefined;
    greenlight();

});

window.addEventListener('beforeunload', function () {
    if (addedingrlist.length > 0) {
        this.localStorage.oldaddedingrlist = JSON.stringify(addedingrlist);
    }
});
document.addEventListener('DOMContentLoaded', function () {
    if (localStorage.oldaddedingrlist) {
        let windowscrool = window.pageYOffset;
        let oldlist = JSON.parse(localStorage.oldaddedingrlist);
        oldlist.forEach(function (a) {
            let i = document.querySelector("#" + a.id);
            let addi = i.cloneNode(true);
            addi.style.position = 'absolute';
            if (a.type == 'korg') {
                addi.style.zIndex = '2';
            }
            else if (a.type == 'souse') {
                addi.style.zIndex = '3';
            }
            else {
                addi.style.zIndex = '4';
            }
            tbcenter.appendChild(addi);
            adelse(addi, windowscrool);
        })
        greenlight();
        cost();
    }
});
function checkpossibadd(addingr, switchclik) {
    if (addingr.id == 'smallkorg' || addingr.id == 'midkorg' || addingr.id == 'bigkorg') {
        addingr.style.zIndex = '2';
        adelse(addingr, switchclik);
    }
    else {
        if (!korgsizeadded) {
            alert('Сначала виберите размер коржа');
            tbcenter.removeChild(addingr);
        }
        else {
            if (addingr.id == 'ketchup' || addingr.id == 'bbq' || addingr.id == 'slivochniy' || souseadded) {
                if (addingr.id == 'ketchup' || addingr.id == 'bbq' || addingr.id == 'slivochniy') {
                    addingr.style.zIndex = '3';
                }
                else {
                    addingr.style.zIndex = '4';
                }
                adelse(addingr, switchclik);
            }
            else {
                alert('Сначала виберите соус');
                tbcenter.removeChild(addingr);
            }
        }
    }
}
function pushing(a, i) {
    let addedingr = a.cloneNode(true);
    addedingr.className = '';
    tbcenter.appendChild(addedingr);
    tbcenter.removeChild(a);
    addedingrarr.push(addedingr);
    addedingrlist.push(i);
}
function dablingr(e, q) {
    if (!q) {
        q = e.target;
    }
    if (q.style.backgroundColor == 'green') {
        q.style.backgroundColor = 'rgb(209, 140, 49)';
        let deldabl = false;
        addedingrlist.forEach(function (x, y) {
            if (q.parentNode.className == x.id && deldabl == false) {
                addedingrlist.splice(y, 1);
                toppingadded--;
                deldabl = true;
            }
        });
        cost();
    }
    else {
        if (toppingadded < 6) {
            q.style.backgroundColor = 'green';
            ingrlist.forEach(function (x) {
                if (q.parentNode.className == x.id) {
                    addedingrlist.push(x);
                }
            });
            cost();
            toppingadded++;
        }
        else {
            alert('Можно вибрать не более 6 порций топпингов');
        }
    }
}
function removeingr(e, q) {
    let enaf;
    if (!q) {
        q = e.target.parentNode;
    }
    if (q.firstChild.style.backgroundColor == 'green') {
        addedingrlist.forEach(function (x, y) {
            if (q.className == x.id) {
                addedingrlist.splice(y, 1);
                toppingadded--;
            }
        });
    }
    addedingrlist.forEach(function (x, y) {
        if (q.className == x.id) {
            addedingrlist.splice(y, 1);
            switch (x.type) {
                case 'korg':
                    if (e) {
                        reseting();
                        enaf = true;
                    }
                    break;
                case 'souse':
                    if (e) {
                        souseadded = false;
                    }
                    break;
                default:
                    toppingadded--;
                    break;
            }
        }
    });
    if (enaf) {
        return;
    }
    addedingrarr.forEach(function (x, y) {
        if (q.className == x.id) {
            tbcenter.removeChild(x);
            addedingrarr.splice(y, 1);
        }
    });
    cost();
    compound.removeChild(q);
    greenlight();
}
function compoundadd(i) {
    let x = document.createElement('p');
    let b = document.createElement('span');
    let c = document.createElement('span');
    b.innerHTML = i.name;
    c.innerHTML = 'убрать';
    x.style.margin = '3px 0px 3px 0px';
    x.style.width = '30vh';
    x.style.display = 'flex';
    x.style.flexDirection = 'row';
    x.style.justifyContent = 'start';
    b.className = 'compaundaddedingr';
    c.className = 'compaundaddedingr';
    b.style.backgroundColor = 'rgb(209, 140, 49)';
    c.style.backgroundColor = 'rgb(209, 140, 49)';
    c.style.cursor = 'pointer';
    x.className = i.id;
    compound.appendChild(x);
    if (i.type == 'topping') {
        let a = document.createElement('span');
        a.innerHTML = '2x';
        a.className = 'compaundaddedingr';
        a.style.backgroundColor = 'rgb(209, 140, 49)';
        a.style.cursor = 'pointer';
        x.appendChild(a);
        a.addEventListener('click', dablingr);
    }
    x.appendChild(b);
    x.appendChild(c);
    c.addEventListener('click', removeingr);
}
function cost() {
    costcount = 0;
    addedingrlist.forEach(function (a) {
        costcount = costcount + +a.cost;
    });
    if (!sellindex) {
        if (localStorage.sellindex) {
            sellindex = localStorage.sellindex; 
        }
        else {
            sellindex = 1;
        }
    }
    costcount = Math.round(costcount * sellindex);
    document.querySelector('#cost').innerHTML = `${costcount} грн.`;
}
function switchingr(x) {
    let delingr;
    let q;
    addedingrlist.forEach(function (a, b) {
        if (a.type == x) {
            delingr = a;
        }
    });
    if (delingr) {
        compound.childNodes.forEach(function (a) {
            if (a.className == delingr.id) {
                q = a;
            }
        });
        removeingr(false, q);
    }
}
function adelse(a, b) {
    let i;
    for (let l = 0; l < ingrlist.length; l++) {
        if (ingrlist[l].id == a.id) {
            i = ingrlist[l];
            break;
        }
    }
    let coordtbcenter = tbcenter.getBoundingClientRect();
    if (i.size) {
        a.style.height = i.size + 'vh';
    }
    else if (korgsizeadded) {
        a.style.height = korgsizeadded + 'vh';
    }
    else {
        a.style.height = 50 + 'vh';
    }
    let precoordaddedingr = a.getBoundingClientRect();
    a.style.top = coordtbcenter.top + b - (precoordaddedingr.height / 2) + 'px';
    a.style.left = coordtbcenter.left - (precoordaddedingr.width / 2) + 'px';
    if (i.type == 'korg') {
        korgsizeadded = i.size;
        switchingr('korg');
        addedingrarr.forEach(function (x) {
            x.style.height = i.size + 'vh';
            x.style.top = a.style.top;
            x.style.left = a.style.left;
        })
        compoundadd(i);
        pushing(a, i);
    }
    if (i.type == 'souse') {
        souseadded = true;
        switchingr('souse');
        compoundadd(i);
        pushing(a, i);
    }
    if (i.type == 'topping') {
        if (toppingadded < 6) {
            let g = 0;
            addedingrlist.forEach(function (k) {
                if (k == i) {
                    g++;
                }
            });
            switch (g) {
                case 0:
                    compoundadd(i);
                    toppingadded++;
                    pushing(a, i);
                    break;
                case 1:
                    let needdabled;
                    compound.childNodes.forEach(function (a) {
                        if (a.className == i.id) {
                            needdabled = a;
                        }
                    });
                    dablingr(false, needdabled.firstChild);
                    tbcenter.removeChild(a);
                    break;
                case 2:
                    alert('Можно вибрать не более 2 порций одного вида топпинга');
                    tbcenter.removeChild(a);
                    return;
                default:
                    break;
            }
            a.style.zIndex = '4';
        }
        else {
            alert('Можно вибрать не более 6 порций топпингов');
            tbcenter.removeChild(a);
            return;
        }

    }
    cost();
}

resetp.addEventListener('click', reseting);
var sellindex;
document.addEventListener('DOMContentLoaded', function () {
    if (localStorage.sellindex) {
        sellindex = parseFloat(localStorage.sellindex);
        mn.removeChild(banner);
        if (sellindex != 1) {
            sellarticling();
        }
    }
    else {
        sellindex = 1;
        banner.style.display = 'block';
        banner.addEventListener('mousemove', function dodge(e) {
            let gab = banner.getBoundingClientRect();
            function right(a) {
                if ((e.clientX + gab.width) < maxx) {
                    banner.style.left = e.clientX + "px";
                }
                else {
                    left();
                }
            }
            function left(a) {
                let r = gab.left - (gab.right - e.clientX);
                if (r > 0) {
                    banner.style.left = r + "px";
                }
                else {
                    right();
                }
            }
            function top(a) {
                let b = gab.top - (gab.bottom - e.clientY);
                if (b > 0) {
                    banner.style.top = b + "px";
                }
                else {
                    bottom();
                }
            }
            function bottom(a) {
                if ((e.clientY + gab.height) < maxy) {
                    banner.style.top = e.clientY + "px";
                }
                else {
                    top();
                }
            }
            if (e.clientX > (gab.left + (gab.width / 2))) {
                left();
            }
            else {
                right();
            }
            if (e.clientY > (gab.top + (gab.height / 2))) {
                top();
            }
            else {
                bottom();
            }
        });
        ban2.addEventListener('click', () => {
            mn.removeChild(banner);
            localStorage.sellindex = 0.8;
            sellindex = 0.8;
            cost();
            sellarticling();
        });
    }
});
function sellarticling () {
    $('#cost').css({color: 'green', fontWeight: 'bold'});
    $('#costanot').css('color', 'green');
    let sellban = document.createElement('div');
    let costcompound = document.querySelector('#costcompound');
    sellban.className = 'sellbanner';
    sellban.innerHTML = 'Вы получили скидку';
    costcompound.appendChild(sellban);
}
var intervallightning = setInterval(lightning, 500);
function lightning() {
    if (sellindex == 1) {
        let r = Math.floor(Math.random() * (255 - 1) + 1);
        let g = Math.floor(Math.random() * (255 - 1) + 1);
        let b = Math.floor(Math.random() * (255 - 1) + 1);
        ban2.style.color = "rgb(" + r + " " + g + " " + b + ")";
    }
    sbmt.style.boxShadow = `-1vw 0vw ${Math.round(Math.random()) + 2}vw 1vw gray`;
    rst.style.boxShadow = `1vw 0vw ${Math.round(Math.random()) + 2}vw 1vw gray`;
}
const footerform = document.querySelector('footer form');
function valideventinput() {
    let f = document.forms[0].elements;
    for (let i = 0; i < f.length; i++) {
        if (f[i].type == 'text') {
            f[i].addEventListener('change', validtextinput);
        }
        if (f[i].type == 'radio') {
            f[i].addEventListener('change', validradioinput);
        }
    }
}
valideventinput();
function validtextinput(e, x) {
    if (!x) {
        x = e.target;
    }
    let a = patternobj[x.id].pattern;
    let b = patternobj[x.id].antipattern;
    let patternpass = true;
    let antipatternpass = true;
    if (a) {
        patternpass = a.test(x.value);
    }
    if (b) {
        antipatternpass = !b.test(x.value);
    }
    if (patternpass && antipatternpass) {
        x.parentNode.classList.remove('invalid');
        x.parentNode.classList.add('valid');
        if (x.parentNode.lastChild.tagName == 'SPAN') {
            x.parentNode.removeChild(x.parentNode.lastChild);
        }
    }
    else {
        x.parentNode.classList.remove('valid');
        x.parentNode.classList.add('invalid');
        infospanfromvalidation(x.parentNode, 'Введите данные правильно');
    }
}
function infospanfromvalidation(a, b) {
    if (a.lastChild.tagName != 'SPAN') {
        let c = document.createElement('span');
        c.innerHTML = b;
        c.style.border = '1px white solid';
        c.style.borderRadius = '5px';
        c.style.padding = '5px';
        a.appendChild(c);
    }
}
function validradioinput(e, x) {
    if (!x) {
        x = e.target;
    }
    x.parentNode.parentNode.childNodes.forEach(function (a) {
        if (a.tagName == 'DIV') {
            a.classList.remove('valid');
        }
    });
    if (x.checked) {
        x.parentNode.classList.add('valid');
        x.parentNode.parentNode.classList.add('validradio');
        if (x.id == 'emailwriting') {
            let dontneed = document.querySelector('#tel').parentNode;
            dontneed.classList.add('dontneed');
            infospanfromvalidation(dontneed, 'Необязательно');
            document.querySelector('#email').parentNode.classList.remove('dontneed');
            if (document.querySelector('#email').parentNode.lastChild.tagName == 'SPAN') {
                document.querySelector('#email').parentNode.removeChild(document.querySelector('#email').parentNode.lastChild);
            }
        }
        else {
            let dontneed = document.querySelector('#email').parentNode;
            dontneed.classList.add('dontneed');
            infospanfromvalidation(dontneed, 'Необязательно');
            document.querySelector('#tel').parentNode.classList.remove('dontneed');
            if (document.querySelector('#tel').parentNode.lastChild.tagName == 'SPAN') {
                document.querySelector('#tel').parentNode.removeChild(document.querySelector('#tel').parentNode.lastChild);
            }
        }
    }
}
function validationform() {
    let f = document.forms[0].elements;
    for (let i = 0; i < f.length; i++) {
        if (document.forms[0].elements[i].type == 'text') {
            if (!document.forms[0].elements[i].parentNode.classList.contains('valid') && !document.forms[0].elements[i].parentNode.classList.contains('dontneed')) {
                alert('Введите пожалуйста данные для оформления заказа');
                return false;
            }
        }
        if (document.forms[0].elements[i].type == 'radio') {
            if (!document.forms[0].elements[i].parentNode.parentNode.classList.contains('validradio')) {
                alert('Введите пожалуйста данные для оформления заказа');
                return false;
            }
        }
    }
    return true;
}
function validationpizza() {
    if (!greenlight()) {
        if (souseadded) {
            alert(`Добавьте в пиццу хотя бы один топпинг`);
        }
        else {
            if (korgsizeadded) {
                alert(`Добавьте в пиццу соус и топпинги`);
            }
            else {
                alert(`Выберите сначала необходимые ингридиенты для пиццы`);
            }
        }
        return false;
    }
    else {
        return true;
    }
}
footerform.addEventListener('submit', function (e) {
    let vf = validationform();
    let vp = validationpizza();
    if (!vf || !vp) {
        e.preventDefault();
        return;
    }
    else {
        localStorage.sellindex = 1;
    }
});
function resetform() {
    let f = document.forms[0].elements;
    for (let i = 0; i < f.length; i++) {
        if (f[i].type == 'text') {
            f[i].parentNode.classList.remove('valid', 'invalid', 'dontneed');
            if (f[i].parentNode.lastChild.tagName == 'SPAN') {
                f[i].parentNode.removeChild(f[i].parentNode.lastChild);
            }
        }
        if (f[i].type == 'radio') {
            f[i].parentNode.classList.remove('valid');
            f[i].parentNode.parentNode.classList.remove('validradio');
        }
    }
}
footerform.addEventListener('reset', function () {
    setTimeout(resetform, 20);
});

//Хочу: Сделать адаптивную верстку.
var slidercount = 0;
var se = false;
var es = false;
var est;
var set;
function scroll(a, quantity, transition) {
    if (es) {
        clearTimeout(est);
        scrollendstart();
    }
    if (se) {
        clearTimeout(set);
        scrollstartend();
    }
    slidercount = slidercount + a;
    function marginscrolltimeout(a) {
        $('#sliderline').css({
            transition: (transition + 's'),
            left: ((slidercount + (a * -1)) * 60) + 'vw'
        });
    }
    function scrollendstart() {
        $('#sliderline').css('transition', '0s');
        $('#sliderline img:first').css('order', '0');
        slidercount = 0;
        $('#sliderline').css('left', slidercount * 60 + 'vw');
        es = false;
    }
    function scrollstartend() {
        $('#sliderline').css('transition', '0s');
        $('#sliderline img:last').css('order', '0');
        slidercount = ((quantity * -1) + 1);
        $('#sliderline').css('left', slidercount * 60 + 'vw');
        se = false;
    }
    function ordinarscroll() {
        $('#sliderline').css('transition', (transition + 's'));
        let x = $('#sliderline').css('transition');
        $('#sliderline').css('left', (slidercount * 60) + 'vw');
        let y = $('#sliderline').css('left');
        $('#sliderline').css('transition', '0s');
    }
    if (slidercount <= (quantity * -1)) {
        $('#sliderline img:first').css('order', '1');
        $('#sliderline').css('left', ((slidercount + 2) * 60) + 'vw');
        setTimeout(marginscrolltimeout, 50, a);
        est = setTimeout(scrollendstart, 1050);
        es = true;
    }
    else {
        if (slidercount > 0) {
            $('#sliderline img:last').css('order', '-1');
            $('#sliderline').css('left', ((slidercount - 2) * 60) + 'vw');
            setTimeout(marginscrolltimeout, 50, a);
            set = setTimeout(scrollstartend, 1050);
            se = true;
        }
        else {
            setTimeout(ordinarscroll, 5);
        }
    }
}
$('#slidercont button:last').click(function () {
    scroll(-1, 3, 1);
    clearInterval(scrollinterv);
    scrollinterv = setInterval(scroll, 5000, -1, 3, 1);
});
$('#slidercont button:first').click(function () {
    scroll(1, 3, 1);
    clearInterval(scrollinterv);
    scrollinterv = setInterval(scroll, 5000, 1, 3, 1);
});
var scrollinterv;
$(document).ready(function () {
    scrollinterv = setInterval(scroll, 5000, -1, 3, 1);
});
function randompizzing() {
    function randompartpizzing(typeingr) {
        function rand() {
            return Math.floor(Math.random() * number);
        }
        let number = 0;
        let decided1;
        let decided2;
        let decided3;
        ingrlist.forEach(function (a) {
            if (a.type == typeingr) {
                number++;
            }
        });
        decided1 = rand();
        if (typeingr == 'topping') {
            decided2 = rand();
            while (decided2 == decided1) {
                decided2 = rand();
            }
            decided3 = rand();
            while (decided3 == decided1 || decided3 == decided2) {
                decided3 = rand();
            }
            return [number, decided1, decided2, decided3];
        }
        else {
            return [number, decided1];
        }

    }
    let korgnumber;
    let korgdecided;
    let sousenumber;
    let sousedecided;
    let toppingnumber;
    let toppingdecided1;
    let toppingdecided2;
    let toppingdecided3;
    let x = randompartpizzing('korg');
    korgnumber = x[0];
    let y = randompartpizzing('souse');
    sousenumber = y[0];
    let z = randompartpizzing('topping');
    toppingnumber = z[0];
    if (toppingadded > 0) {
        reseting();
    }
    toppingdecided1 = z[1] + korgnumber + sousenumber;
    toppingdecided2 = z[2] + korgnumber + sousenumber;
    toppingdecided3 = z[3] + korgnumber + sousenumber;
    if (!souseadded) {
        sousedecided = y[1] + korgnumber;
    }
    if (!korgsizeadded) {
        korgdecided = x[1];
    }
    return [korgnumber, korgdecided, sousenumber, sousedecided, toppingnumber, toppingdecided1, toppingdecided2, toppingdecided3];
}
function randomaddflying(count) {
    let i = ingrlist[count].id;
    let addingr = document.querySelector('#' + i);
    let a = tbcenter.getBoundingClientRect();
    let b = addingr.getBoundingClientRect();
    let addi = addingr.cloneNode(true);
    addi.style.position = 'absolute';
    addi.style.zIndex = '4';
    $('main').append(addi);
    addi.style.top = b.top + window.pageYOffset + "px";
    addi.style.left = b.left + "px";
    addi.animate({
        top: a.top + window.pageYOffset + "px",
        left: a.left + "px",
        with: 0,
        height: 0
    }, 930, 'linear');
}
function randomadding(count) {
    mn.removeChild(mn.lastChild);
    let i = ingrlist[count].id;
    let addingr = document.querySelector('#' + i);
    let addi = addingr.cloneNode(true);
    addi.style.position = 'absolute';
    if (ingrlist[count].type == 'korg') {
        addi.style.zIndex = '2';
    }
    else if (ingrlist[count].type == 'souse') {
        addi.style.zIndex = '3';
    }
    else {
        addi.style.zIndex = '4';
    }
    tbcenter.appendChild(addi);
    adelse(addi, window.pageYOffset);
    greenlight();
}
function randomingrlightning(startlight, stoplight, decided, cnum) {
    let ingrlightlist = $('.cell');
    let circl = 1;
    let stopcircl = cnum;
    let count = startlight;
    let stopdecid = decided;
    function finishlightbar(count) {
        ingrlightlist[count].classList.remove('decideingridient');
    }
    function lightdecid(count) {
        ingrlightlist[count].classList.remove('focusingridient');
        ingrlightlist[count].classList.add('decideingridient');
        randomaddflying(count);
        ruletTimeOutAdd = setTimeout(randomadding, 950, count);
        ruletTimeOutLight = setTimeout(finishlightbar, 1000, count);
    }
    function lightbar(count, circl, stopcircl, stopdecid) {
        if (count == startlight) {
            ingrlightlist[(stoplight - 1)].classList.remove('focusingridient');
            ingrlightlist[count].classList.add('focusingridient');
        }
        else {
            ingrlightlist[(count - 1)].classList.remove('focusingridient');
            ingrlightlist[count].classList.add('focusingridient');
        }
        if (circl != stopcircl || count != stopdecid) {
            count++;
            if (count == stoplight) {
                count = startlight;
                circl++;
            }
            ruletTimeOutLight = setTimeout(lightbar, 300, count, circl, stopcircl, stopdecid);
        }
        else {
            ruletTimeOutLight = setTimeout(lightdecid, 300, count);
        }
    }
    lightbar(count, circl, stopcircl, stopdecid);

}
function ruletend() {
    canspin = true;
    document.querySelector('#rulet img').classList.remove('ruletanimation');
}
var canspin = true;
var ruletTimeOut1;
var ruletTimeOut2;
var ruletTimeOut3;
var ruletTimeOut4;
var ruletTimeOut5;
var ruletTimeOutLight;
var ruletTimeOutAdd;
$('#rulet button').click(function () {
    if (canspin) {
        canspin = false;
        let x = randompizzing();
        let delay1 = 0;
        let delay2 = 0;
        let delay3 = 0;
        let delay4 = 0;
        if (x[1] >= 0) {
            delay1 = x[0] * 300 * 3 + 1000;
            randomingrlightning(0, x[0], x[1], 3);
        }
        if (x[3]) {
            delay2 = delay1 + x[2] * 300 * 3 + 1000;
            ruletTimeOut1 = setTimeout(randomingrlightning, delay1, x[0], x[0] + x[2], x[3], 3);
        }
        delay3 = delay2 + (x[5] - x[0] - x[2] + 1) * 300 + 1000;
        delay4 = delay3 + (x[6] - x[0] - x[2] + 1) * 300 + 1000;
        let finaldelay = delay4 + (x[6] - x[0] - x[2] + 1) * 300;
        ruletTimeOut2 = setTimeout(randomingrlightning, delay2, x[0] + x[2], x[0] + x[2] + x[4], x[5], 1);
        ruletTimeOut3 = setTimeout(randomingrlightning, delay3, x[0] + x[2], x[0] + x[2] + x[4], x[6], 1);
        ruletTimeOut4 = setTimeout(randomingrlightning, delay4, x[0] + x[2], x[0] + x[2] + x[4], x[7], 1);
        ruletTimeOut5 = setTimeout(ruletend, finaldelay);
        document.querySelector('#rulet img').classList.add('ruletanimation');
    }
});