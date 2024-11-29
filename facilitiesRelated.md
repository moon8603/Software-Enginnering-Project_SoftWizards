# 시설 정보 추가하는 방법 (JSON) 🏢

## 시설 좌표 찾기 🌍
1. 웹사이트 접속
   - 이 지도 사이트를 기반으로 프로젝트를 개발하고 있으므로 해당 웹사이트의 좌표 정보를 사용하는 것이 바람직하다.
   https://www.openstreetmap.org/#map=18/37.583659/127.059787

2. 좌표 정보 확인
   - 원하는 위치에 오른쪽 클릭 후 'Show address'를 선택하다.
   - 좌표 정보가 화면 왼쪽에 나타난다.
   ![image](https://github.com/user-attachments/assets/ea6fe8c5-4c15-4e61-80ad-2a3686160a48)

## JSON 파일에서 정보 추가하기 📁
1. 파일 구조
   - 다음은 현재 작성 기준의 파일 구조이다. `facilities.json` 파일에서 시설 정보를 추가한다.
   - ![image](https://github.com/user-attachments/assets/e6154d9b-914f-4a01-8d9f-b4c2653931db)

2. JSON 형식의 규칙
   - 아래 구조 형식에 따라 작성한다. 따옴표(`"`), 괄호, 데이터 타입, 쉼표 형식을 준수해야 한다.
   - ![image](https://github.com/user-attachments/assets/1c6d494e-1913-4ada-a7f1-ac963d13bc4e)

### 필드 설명 🔍
- **"id"**: 
  - 고유번호로, 서로 다른 값을 가져야 한다. 
  - 양수 정수형(int type)으로 입력해야 하며, ID번호는 지도에서 표시되지 않지만 코드 실행에 필요하다.

- **"name"**: 
  - 시설 이름으로, string type으로 작성해야 하며 지도에 표시된다.

- **"coordinates"**: 
  - 시설의 좌표(위도, 경도) 정보로, Array type으로 대괄호 안에 입력해야 한다.

- **"description"**: 
  - 시설 설명으로 string type으로 작성할 수 있으며, 지도에 표시된다.

- **"workingHour"**: 
  - 시설의 영업시간 정보로, 지도에 표시된다. 

- **"type"**: 
  - Array type으로 여러 요소를 가질 수 있으며, 필터링 작업에 사용된다. 
  - 현재는 한국어로 작성되었지만 향후 영어로 변경될 수 있다.

### 추가 정보 ✏️
- 추가적인 정보가 필요한 경우, JSON 형식에 맞춰 추가 가능하다. 예를 들어 주의사항을 추가하고자 할 경우, `"caution": "some caution info"` 형식으로 입력하며, 주의사항이 없는 경우 value 값에 `NULL`을 적어야 합니다.

### 참고 이미지 🖼️
- 현재 지도에 나타나는 한 아이콘의 상세정보 예시는 다음과 같다.
  - ![image](https://github.com/user-attachments/assets/12a78662-b152-4c37-87f3-b987b26dc3e6)

