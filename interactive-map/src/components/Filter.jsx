// 현재 코드에서는 사용 안 함
import { Button } from '@mantine/core'


const Filter = ({onFilter}) => {
  return (
    <Button 
      style={{width: "120px"}}
      onClick={onFilter}  
    >
      필터
    </Button>
  )
}

export default Filter
