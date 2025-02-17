import { useState } from "react";
import { NavLink as RRNavLink } from "react-router-dom";
import {
  Button,
  Collapse,
  Nav,
  NavLink,
  NavItem,
  Navbar,
  NavbarBrand,
  NavbarToggler,
} from "reactstrap";
import { logout } from "../managers/authManager";

export default function NavBar({ loggedInUser, setLoggedInUser }) {
  const [open, setOpen] = useState(false);

  const toggleNavbar = () => setOpen(!open);

  return (
    <div>
      <Navbar color="dark" dark fixed="true" expand="lg">
        <NavbarBrand className="mr-auto" tag={RRNavLink} to="/">
          ✍️ Tabloid
        </NavbarBrand>
        {loggedInUser ? (
          <>
            <NavbarToggler onClick={toggleNavbar} />
            <Collapse isOpen={open} navbar>
              <Nav navbar>
                <NavItem>
                  <NavLink tag={RRNavLink} to="/">
                    Home
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={RRNavLink} to="/explore">
                    Explore
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={RRNavLink} to="/posts/new">
                    New Post
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={RRNavLink} to="/subscribed">
                    Subscribed Posts
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={RRNavLink} to="/posts/myposts">
                    My Posts
                  </NavLink>
                </NavItem>
                {loggedInUser.roles.includes("Admin") && (
                  <>
                    <NavItem>
                      <NavLink tag={RRNavLink} to="/userprofiles">
                        User Profiles
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink tag={RRNavLink} to="/categories">
                        Categories
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink tag={RRNavLink} to="/tags">
                        Tags
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink tag={RRNavLink} to="/reactions">
                        Reactions
                      </NavLink>
                    </NavItem>
                  </>
                )}
              </Nav>
            </Collapse>
            <Nav className="ms-auto d-flex flex-row align-items-center gap-3">
              <NavItem>
                <span className="text-light">
                  Welcome,{" "}
                  {loggedInUser.name || loggedInUser.userName || "User"}
                </span>
              </NavItem>
              <NavItem>
                <Button
                  color="primary"
                  onClick={(e) => {
                    e.preventDefault();
                    setOpen(false);
                    logout().then(() => {
                      setLoggedInUser(null);
                      setOpen(false);
                    });
                  }}
                >
                  Logout
                </Button>
              </NavItem>
            </Nav>
          </>
        ) : (
          <Nav navbar>
            <NavItem>
              <NavLink tag={RRNavLink} to="/login">
                <Button color="primary">Login</Button>
              </NavLink>
            </NavItem>
          </Nav>
        )}
      </Navbar>
    </div>
  );
}
