// 반드시 최상단에 위치해야 합니다 (Navigation 에러 방지)
import 'react-native-gesture-handler'; 
import { registerRootComponent } from 'expo';
import App from './App';

// registerRootComponent는 환경(네이티브, 웹)에 상관없이 
// App 컴포넌트가 제대로 렌더링되도록 보장합니다.
registerRootComponent(App);