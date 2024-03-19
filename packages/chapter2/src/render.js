export function jsx(type, props, ...children) {
  return { type, props, children: children };
}

export function createElement(node) {
  // jsx를 dom으로 변환
  if (typeof node === "string") {
    return document.createTextNode(node);
  }

  const $el = document.createElement(node.type);

  Object.entries(node.props || {}).forEach(
    ([attr, value]) => value && $el.setAttribute(attr, value)
  );

  try {
    node.children.map(createElement).forEach((child) => $el.appendChild(child));
  } catch (e) {
    console.log(node);
    console.error(e);
  }

  return $el;
}

function updateAttributes(target, newProps, oldProps) {
  // 달라지거나 추가된 Props를 반영
  // for (const [attr, value] of Object.entries(newProps)) {
  //   if (oldProps[attr] === newProps[attr]) continue;
  //   target.setAttribute(attr, value);
  // }

  // // 없어진 props를 attribute에서 제거
  // for (const attr of Object.keys(oldProps)) {
  //   if (newProps[attr] !== undefined) continue;
  //   target.removeAttribute(attr);
  // }

  for (const [attr, value] of Object.entries(newProps)) {
    target.setAttribute(attr, value);
  }

  // 이전 속성 중에 새로운 속성에 없는 것들을 제거
  for (const attr of Object.keys(oldProps)) {
    if (!(attr in newProps)) {
      target.removeAttribute(attr);
    }
  }

  // newProps들을 반복하여 각 속성과 값을 확인
  //   만약 oldProps에 같은 속성이 있고 값이 동일하다면
  //     다음 속성으로 넘어감 (변경 불필요)
  //   만약 위 조건에 해당하지 않는다면 (속성값이 다르거나 구속성에 없음)
  //     target에 해당 속성을 새 값으로 설정
  // oldProps을 반복하여 각 속성 확인
  //   만약 newProps들에 해당 속성이 존재한다면
  //     다음 속성으로 넘어감 (속성 유지 필요)
  //   만약 newProps들에 해당 속성이 존재하지 않는다면
  //     target에서 해당 속성을 제거
}

export function render(parent, newNode, oldNode, index = 0) {
  if (!newNode && oldNode) {
    return parent.removeChild(parent.childNode[index]);
  }
  if (newNode && !oldNode) {
    return parent.appendChild(createElement(newNode));
  }
  if (
    typeof newNode === "string" &&
    typeof oldNode === "string" &&
    newNode !== oldNode
  ) {
    parent.replaceChild(createElement(newNode), parent.childNodes[index]);
  }
  if (newNode.type !== oldNode.type) {
    return parent.replaceChild(
      createElement(newNode),
      parent.childNodes[index]
    );
  }

  updateAttributes(
    parent.childNodes[index],
    newNode.props || {},
    oldNode.props || {}
  );

  console.log({ newNode });
  console.log({ oldNode });

  const maxLength = Math.max(
    newNode.children ? newNode.children.length : 0,
    oldNode.children ? oldNode.children.length : 0
  );

  for (let i = 0; i < maxLength; i++) {
    render(
      parent.childNodes[index],
      newNode.children[i],
      oldNode.children[i],
      i
    );
  }

  // 1. 만약 newNode가 없고 oldNode만 있다면
  //   parent에서 oldNode를 제거
  //   종료
  // 2. 만약 newNode가 있고 oldNode가 없다면
  //   newNode를 생성하여 parent에 추가
  //   종료
  // 3. 만약 newNode와 oldNode 둘 다 문자열이고 서로 다르다면
  //   oldNode를 newNode로 교체
  //   종료
  // 4. 만약 newNode와 oldNode의 타입이 다르다면
  //   oldNode를 newNode로 교체
  //   종료
  // 5. newNode와 oldNode에 대해 updateAttributes 실행
  // 6. newNode와 oldNode 자식노드들 중 더 긴 길이를 가진 것을 기준으로 반복
  //   각 자식노드에 대해 재귀적으로 render 함수 호출
}
