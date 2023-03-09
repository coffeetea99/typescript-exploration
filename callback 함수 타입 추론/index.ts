// async 라이브러리의 map 함수는 대충 아래와 같은 타입을 가지고 있다.

function asyncMap<T, R>(
  arr: T[],
  iterator: (item: T, callBack: (err: Error, result: R) => void) => void,
  final: (err: Error, result: R[]) => void
) {}

// 그런데 아래와 같이 작성하면 asyncMap의 T는 타입이 자동으로 추론을 하지만 R은 추론하지 못한다.

asyncMap(
  [1, 2, 3],
  function (item, callBackInside) {
    callBackInside(new Error(), 'some string');
  },
  function (err, results) {
    console.log(results);
  }
);

// 이는 아래 customFunc1과 customFunc2를 보면 (아마도) 왜 그런지 알 수 있다.

function customFunc1<T1>(
  func1: (result: T1) => void
) {}

customFunc1(
  function (n) {
    console.log(n);
  }
);

function customFunc2<T2>(
  func1: (func2: (result: T2) => void) => void
) {}

customFunc2(
  function (callBackInside) {
    callBackInside(3);
  }
);

// customFunc1에서 n은 unknown이다. n을 가지고 어떤 짓을 한다고 해도 그걸 가지고 n으로 추론하지는 않는다.
// n을 typing 하지 않는 한 그렇다.
// customFunc2의 callBackInside도 비슷하다. callBackInside를 가지고 어떤 짓(∋ 3을 인자로 넣어서 호출하기)을 하든 그걸로 callBackInside 의 타입을 추론하지는 않는다.
// func2의 typing 정보만을 가지고 (result: unknown) => void 이라고만 추론할 뿐이다.
