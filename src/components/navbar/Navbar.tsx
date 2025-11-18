import NavbarContainer from "./NavbarContainer.tsx";
import Head from "./Head.tsx";
import Foot from "./Foot.tsx";
import StaticLinkContainer from "./StaticLinkContainer.tsx";
import DynamicLinkContainer from "./DynamicLinkContainer.tsx";
import StaticLink from "./StaticLink.tsx";
import {Home} from "lucide-react";
import LinkContainer from "./LinkContainer.tsx";
import {useHistory} from "../../store/historyStore.ts";

const Navbar = () => {
  const { histories } = useHistory()

  const links = {
    title: "Last Updates",
    items: histories
      .filter(h => h.event === "update" && h.type === "workspace")
      .sort((a, b) => {
        return new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
      })
  }

  return (
    <NavbarContainer>
      <Head/>
      <StaticLinkContainer>
        <StaticLink link="/" placeholder="Accueil" icon={Home}/>
      </StaticLinkContainer>
      <DynamicLinkContainer>
        <LinkContainer title={links.title} items={links.items} />
      </DynamicLinkContainer>
      <Foot/>
    </NavbarContainer>
  )
}
export default Navbar
