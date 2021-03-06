'use strict';
{
  let accuracy = 1000000000000;
  let dankai = 4;
  //何段階設定か

  let cherry_kakuritu = [26.214, 25.206, 24.273, 23.406];//総回転数で算出
  // cherry_kakuritu = GetKoyakuKakuritu(cherry_kakuritu);
  let suika_kakuritu = [47.628, 45.958, 42.946, 41.584];//総回転数で算出
  // suika_kakuritu = GetKoyakuKakuritu(suika_kakuritu);

  let hosi_kakuritu = [19.968, 19.378, 18.296, 17.561];//ART中のG数で算出
  // hosi_kakuritu = GetKoyakuKakuritu(hosi_kakuritu);
  let hazure_kakuritu = [11.498, 10.923, 9.930, 9.362];//ART中のG数で算出
  // hazure_kakuritu = GetKoyakuKakuritu(hazure_kakuritu);
  let nabinasi_kakuritu = [2.579, 2.638, 2.750, 2.834];//ART中のG数で算出
  // nabinasi_kakuritu = GetKoyakuKakuritu(nabinasi_kakuritu);


  let kakuritu_test = [18.70, 17.88, 17.04, 15.86,];
  // kakuritu_test = GetKoyakuKakuritu(kakuritu_test);


  //以下入力値
  let soukaiten = parseInt(document.getElementById('soukaiten').value);
  let sou_art = parseInt(document.getElementById('sou_art').value);
  let cherry = parseInt(document.getElementById('cherry').value);
  let suika = parseInt(document.getElementById('suika').value);
  let djz_art = parseInt(document.getElementById('djz_art').value);
  let dt_art = parseInt(document.getElementById('dt_art').value);
  let hazure = parseInt(document.getElementById('hazure').value);
  let hosi = parseInt(document.getElementById('hosi').value);
  let rep = parseInt(document.getElementById('rep').value);

  let art = sou_art + djz_art + dt_art;
  //総art




  document.getElementById('hanbetu').addEventListener('click', Zikkou);

  function Zikkou() {
    let result = [];
    let hiritu = [];
    let goukei = 0;
    for (let i = 0; i < dankai; i++) {
      hiritu.push(CalcBinom(soukaiten, cherry, cherry_kakuritu)[i] +
        CalcBinom(soukaiten, suika, suika_kakuritu)[i] +
        CalcBinom(art, hazure, hosi_kakuritu)[i] +
        CalcBinom(art, hosi, hazure_kakuritu)[i] +
        CalcBinom(art, rep, nabinasi_kakuritu)[i]);
      goukei += hiritu[i];
    }
    hiritu.forEach(e => {
      result.push(Math.round((parseFloat(e / goukei * 100)) * 100) / 100);
    });
    // console.log(hiritu);
    // console.log(goukei);
    console.log(result);
  }

  // console.log(CalcBinom(600, 12, kakuritu_test));
  function CalcBinom(n, x, array) {
    n = BigInt(n);
    x = BigInt(x);
    array = GetKoyakuKakuritu(array);

    if (n < x) {
      console.log("回転数の方が少ない");
      return;
    }

    let goukei = 0n;
    let kakuritu = [];
    //nCx * p^x * (1-p)^(n-x)
    for (let i = 0; i < dankai; i++) {
      let item1 = Combi(n, x);
      let item2 = array[i] ** x;
      let item3 = (BigInt(accuracy) - array[i]) ** (n - x);
      kakuritu.push(item1 * item2 * item3);
      goukei += kakuritu[i]
      // console.log(kakuritu[i]);
    }

    let hiritu = [];
    // let test = 0;
    for (let i = 0; i < dankai; i++) {
      hiritu.push(Math.round((parseFloat((kakuritu[i] / (goukei / BigInt(accuracy)) * 100n)) / accuracy) * 100) / 100);
    }
    // console.log(hiritu);
    return hiritu;
  }

  function GetKoyakuKakuritu(array) {
    let koyaku_kakuritu_p = [];

    for (let i = 0; i < dankai; i++) {
      koyaku_kakuritu_p.push(BigInt(Math.floor(1 / array[i] * accuracy)));
      // console.log(koyaku_kakuritu_p[i]);
    }

    return koyaku_kakuritu_p;
  }


  // 再帰関数
  function Combi(x, y) {
    y = x - y;
    let val = 0n;

    if (y == 0n) {
      val = 1n;
    } else {
      val = Combi(x - 1n, y - 1n) * x / y;
    }

    return val;
  }


}