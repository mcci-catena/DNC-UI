// material-ui
import { Typography } from '@mui/material';

// project imports
import NavGroup from './NavGroup';
import menuItem from 'menu-items';

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
    const optmenuItem = menuItem.items;
    // console.log("MEnu Items: ", optmenuItem);

    let myuser = sessionStorage.getItem('myUser');
    // console.log("MyUser: ", myuser)

    let myuobj = JSON.parse(myuser);
    // console.log('MyObj: ', myuobj);

    if (myuobj.level != '3' && myuobj.level != '4' && optmenuItem.length == 4) {
        optmenuItem.shift();
        optmenuItem.shift();
    }

    // console.log("OptMenu: ", optmenuItem)

    // let mytoken = sessionStorage.getItem('myToken');
    // console.log("MyToken: ", mytoken)

    const navItems = menuItem.items.map((item) => {
        switch (item.type) {
            case 'group':
                return <NavGroup key={item.id} item={item} />;
            default:
            // return (
            //     <Typography key={item.id} variant="h6" color="error" align="center">
            //         Menu Items Error
            //     </Typography>
            // );
        }
    });

    return <>{navItems}</>;
};

export default MenuList;
