import { Outlet, NavLink } from "react-router-dom";

interface IProps {
  a?: number;
  b?: string;
}

/**
 * Home组件,此处限制Home组件为React的一个函数式组件
 */
const Home: React.FC<IProps> = (props) => {
  return (
    <div>
      <div>home</div>
      <Outlet />
      <NavLink
        end
        style={({ isActive }) => ({ color: isActive ? "red" : "black" })}
        to="/home/create"
      >
        新建
      </NavLink>
      <span>|</span>
      <NavLink to="/home/me">我的</NavLink>
    </div>
  );
};

/**
 * 高亮链接,使用NavLink来定制效果
 */

export default Home;
