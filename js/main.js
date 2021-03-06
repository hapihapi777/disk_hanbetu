'use strict';
{
  let accuracy = 1000000000000;

  let cherry_kakuritu = [26.214, 25.206, 24.273, 23.406];
  let suika_kakuritu = [47.628, 45.958, 42.946, 41.584];
  let hosi_kakuritu = [19.968, 19.378, 18.296, 17.561];
  let hazure_kakuritu = [11.498, 10.923, 9.930, 9.362];
  let nabinasi_kakuritu = [2.579, 2.638, 2.750, 2.834];
  
  let dankai = 4;
  //何段階設定か
  
  GetKoyakuKakuritu(cherry_kakuritu);
  GetKoyakuKakuritu(suika_kakuritu);
  GetKoyakuKakuritu(hosi_kakuritu);
  GetKoyakuKakuritu(hazure_kakuritu);
  GetKoyakuKakuritu(nabinasi_kakuritu);

  
  
  

  document.querySelector('button').addEventListener('click', Zikkou);

  function Zikkou() {
    CalcBinom();
  }

  function CalcBinom() {
    console.clear();
    let test_0 = parseInt(document.getElementById("n").value);
    let test_1 = test_0 + 0 + 0;
    let n = BigInt(test_1);
    let x = BigInt(document.getElementById("x").value);

    if (n < x) {
      console.log("回転数の方が少ない");
      return;
    }


    let goukei = 0n;
    let kakuritu = [];
    //nCx * p^x * (1-p)^(n-x)
    for (let i = 0; i < dankai; i++) {
      let item1 = Combi(n, x);
      let item2 = koyaku_kakuritu_p[i] ** x;
      let item3 = (BigInt(accuracy) - koyaku_kakuritu_p[i]) ** (n - x);
      kakuritu.push(item1 * item2 * item3);
      goukei += kakuritu[i]
      // console.log(kakuritu[i]);
    }

    let hiritu = [];
    // let test = 0;
    for (let i = 0; i < dankai; i++) {
      hiritu.push(Math.round((parseFloat((kakuritu[i] / (goukei / BigInt(accuracy)) * 100n)) / accuracy) * 100) / 100);
      console.log(hiritu[i]);
      document.getElementById("kekka_" + [i + 1]).textContent = hiritu[i] + "%";
      // test += hiritu[i];
      // console.log(test);
      // DrawGraph(hiritu);
    }
  }

  function GetKoyakuKakuritu(array) {
    // koyaku_kakuritu_p.splice(0);
  let koyaku_kakuritu_p = [];

    for (let i = 0; i < dankai; i++) {
      
      // console.log(id);
      koyaku_kakuritu_p.push(BigInt(Math.floor(1 / array[i] * accuracy)));
      // koyaku_kakuritu_p.push(BigInt(Math.floor(1/document.getElementById(id).value * accuracy)));
      console.log(koyaku_kakuritu_p[i]);
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