<map version="1.0.1">
<!-- To view this file, download free mind mapping software FreeMind from http://freemind.sourceforge.net -->
<node CREATED="1682587439397" ID="ID_1105091520" MODIFIED="1682665612857" TEXT="Generic DNC UI v2.0">
<richcontent TYPE="NOTE"><html>
  <head>
    
  </head>
  <body>
    <p>
      <b>MCCI Generic DNC v2.0:</b>
    </p>
    <p>
      Data Normalization Console, is a logical data server, designed to provide location based data measurement by providing customized tag mapping on top of the general database where sensor data is organized based on device IDs. This is achieved by adding customized tags to the selected locations and generate query based on the customized tags.
    </p>
    <p>
      
    </p>
    <p>
      Organization Admin (Blue Male Icon): Possess all the major access w.r.t a specific organization.
    </p>
    <p>
      Super Admin (Green Male Icon): Possess all the access across DNC as well as the Organizations (creating Admin, Org, et)
    </p>
    <p>
      Techie (Red Female Icon): Possess access to handle all the Hardware related works for the Application (Stock Management).
    </p>
    <p>
      User (Group Icon): Possess limited access (Only can view Information provided for the User and change his/her user profile info).
    </p>
  </body>
</html></richcontent>
<node CREATED="1682588885804" HGAP="610" ID="ID_378198600" MODIFIED="1683111939803" POSITION="right" TEXT="Dashboard" VSHIFT="791">
<richcontent TYPE="NOTE"><html>
  <head>
    
  </head>
  <body>
    <p>
      Dashboard displays the integrated information of an organization (displays the highlighted info of all other modules).
    </p>
  </body>
</html>
</richcontent>
<node CREATED="1683111687555" ID="ID_1170918243" MODIFIED="1683111701813" TEXT="Organizations"/>
<node CREATED="1683111735089" ID="ID_1597721852" MODIFIED="1683111738852" TEXT="Users"/>
<node CREATED="1683111702321" ID="ID_707479850" MODIFIED="1683111708004" TEXT="Devices"/>
<node CREATED="1683111708527" ID="ID_1117541760" MODIFIED="1683111712232" TEXT="Gateways"/>
<node CREATED="1683111712655" ID="ID_1854408193" MODIFIED="1683111749438" TEXT="Locations"/>
<node CREATED="1683111754745" ID="ID_226394239" MODIFIED="1683111760676" TEXT="..."/>
</node>
<node CREATED="1682587471934" HGAP="9" ID="ID_776421353" MODIFIED="1683111981323" POSITION="right" TEXT="Home" VSHIFT="-864">
<richcontent TYPE="NOTE"><html>
  <head>
    
  </head>
  <body>
    <p>
      Home page
    </p>
  </body>
</html></richcontent>
<arrowlink DESTINATION="ID_776421353" ENDARROW="Default" ENDINCLINATION="0;0;" ID="Arrow_ID_222999498" STARTARROW="None" STARTINCLINATION="0;0;"/>
<linktarget COLOR="#b0b0b0" DESTINATION="ID_776421353" ENDARROW="Default" ENDINCLINATION="0;0;" ID="Arrow_ID_222999498" SOURCE="ID_776421353" STARTARROW="None" STARTINCLINATION="0;0;"/>
<node CREATED="1682587590769" HGAP="330" ID="ID_1599879629" MODIFIED="1683112026852" TEXT="Organization" VSHIFT="833">
<richcontent TYPE="NOTE"><html>
  <head>
    
  </head>
  <body>
    <p>
      Organizations is a logical entity which provides integration of the devices to the end users
    </p>
  </body>
</html></richcontent>
<node CREATED="1682588225289" ID="ID_534030742" MODIFIED="1682589702487" STYLE="fork" TEXT="Add Organization">
<richcontent TYPE="NOTE"><html>
  <head>
    
  </head>
  <body>
    <p>
      Add new organization. This option is only available for Super Admin.
    </p>
  </body>
</html></richcontent>
<icon BUILTIN="male2"/>
<node CREATED="1682589446590" ID="ID_1259324145" MODIFIED="1682589814506" TEXT="Organization Name (Should be UNIQUE)">
<richcontent TYPE="NOTE"><html>
  <head>
    
  </head>
  <body>
    <p>
      Organization Name should be <b>Unique</b>, since this entity is global for the application.
    </p>
  </body>
</html></richcontent>
</node>
</node>
<node CREATED="1682588524804" HGAP="47" ID="ID_1516915070" MODIFIED="1682664339833" TEXT="Organization Panel" VSHIFT="10">
<richcontent TYPE="NOTE"><html>
  <head>
    
  </head>
  <body>
    <p>
      Organization panel displays the organization information in a Table format.
    </p>
    <p>
      
    </p>
    <p>
      Only visible for Super Admin(s).
    </p>
  </body>
</html></richcontent>
<icon BUILTIN="male2"/>
<node CREATED="1682588593327" ID="ID_1650037225" MODIFIED="1682664095795" TEXT="Name">
<richcontent TYPE="NOTE"><html>
  <head>
    
  </head>
  <body>
    <p>
      Lists the organization names
    </p>
  </body>
</html></richcontent>
</node>
<node CREATED="1682588598030" ID="ID_572412872" MODIFIED="1682664124431" TEXT="User">
<richcontent TYPE="NOTE"><html>
  <head>
    
  </head>
  <body>
    <p>
      List the User names in the organ
    </p>
  </body>
</html></richcontent>
</node>
<node CREATED="1682588600735" ID="ID_972576318" MODIFIED="1682664024087" TEXT="Node">
<richcontent TYPE="NOTE"><html>
  <head>
    
  </head>
  <body>
    <p>
      Add / Remove Node.
    </p>
  </body>
</html></richcontent>
</node>
<node CREATED="1682588609666" ID="ID_1442092815" MODIFIED="1682661789882" TEXT="Tags">
<richcontent TYPE="NOTE"><html>
  <head>
    
  </head>
  <body>
    <p>
      Add / Remove Tags
    </p>
  </body>
</html></richcontent>
</node>
<node CREATED="1682588624714" ID="ID_1968691514" MODIFIED="1682661786171" TEXT="Gateway">
<richcontent TYPE="NOTE"><html>
  <head>
    
  </head>
  <body>
    <p>
      Add / Remove Gateways
    </p>
  </body>
</html></richcontent>
</node>
<node CREATED="1682588637659" ID="ID_51345255" MODIFIED="1682661780229" TEXT="Grafana Dashboard URL">
<richcontent TYPE="NOTE"><html>
  <head>
    
  </head>
  <body>
    <p>
      Add / Remove Grafana Dashboard URL
    </p>
  </body>
</html></richcontent>
</node>
<node CREATED="1682661756942" ID="ID_1563667524" MODIFIED="1682663375918" TEXT="Actions">
<richcontent TYPE="NOTE"><html>
  <head>
    
  </head>
  <body>
    <p>
      Actions: Edit / Remove the Organization panel entries.
    </p>
    <p>
      
    </p>
    <p>
      Organization Admin has access to edit / remove all entries except Name;
    </p>
    <p>
      Super Admin has access to edit / remove all enteries
    </p>
  </body>
</html></richcontent>
<node CREATED="1682663343632" ID="ID_402275458" MODIFIED="1682663366325" TEXT="Edit">
<icon BUILTIN="male1"/>
</node>
<node CREATED="1682663346458" ID="ID_416852945" MODIFIED="1682663369901" TEXT="Remove">
<icon BUILTIN="male1"/>
</node>
<node CREATED="1682663351289" ID="ID_1198768989" MODIFIED="1682663363020" TEXT="Delete">
<icon BUILTIN="male2"/>
</node>
</node>
</node>
</node>
<node CREATED="1682588244199" HGAP="330" ID="ID_1787346203" MODIFIED="1683112024209" TEXT="Users" VSHIFT="45">
<node CREATED="1682593300058" HGAP="156" ID="ID_1321779088" MODIFIED="1682666344309" TEXT="Add User" VSHIFT="17">
<richcontent TYPE="NOTE"><html>
  <head>
    
  </head>
  <body>
    <p>
      Add User ()
    </p>
  </body>
</html></richcontent>
<icon BUILTIN="male1"/>
<node CREATED="1682665105002" ID="ID_1909619898" MODIFIED="1682665320150" TEXT="Add Name (Optional)"/>
<node CREATED="1682665189901" ID="ID_1170189143" MODIFIED="1682665324693" TEXT="Add Email ID"/>
<node CREATED="1682665194715" ID="ID_1512352376" MODIFIED="1682665333768" TEXT="Assign Role">
<node CREATED="1682665242794" ID="ID_1739223517" MODIFIED="1682665257152" TEXT="Super Admin"/>
<node CREATED="1682665257725" ID="ID_1711784162" MODIFIED="1682665262888" TEXT="Organization Admin"/>
<node CREATED="1682665263901" ID="ID_1270380239" MODIFIED="1682665266626" TEXT="Techie"/>
<node CREATED="1682665267660" ID="ID_1269383514" MODIFIED="1682665304312" TEXT="User"/>
</node>
</node>
<node CREATED="1682588524804" HGAP="325" ID="ID_1730225476" MODIFIED="1682666369565" TEXT="Users Panel" VSHIFT="-81">
<richcontent TYPE="NOTE"><html>
  <head>
    
  </head>
  <body>
    <p>
      User panel displays the user information in a Table format.
    </p>
    <p>
      
    </p>
    <p>
      Visible for both Super &amp; Organization Admin
    </p>
  </body>
</html></richcontent>
<icon BUILTIN="male2"/>
<icon BUILTIN="male1"/>
<node CREATED="1682588593327" ID="ID_942962413" MODIFIED="1682662072169" TEXT="First Name">
<richcontent TYPE="NOTE"><html>
  <head>
    
  </head>
  <body>
    <p>
      First name of the user
    </p>
  </body>
</html></richcontent>
</node>
<node CREATED="1682588598030" ID="ID_59284403" MODIFIED="1682662075178" TEXT="Last Name">
<richcontent TYPE="NOTE"><html>
  <head>
    
  </head>
  <body>
    <p>
      Last name of the user
    </p>
  </body>
</html></richcontent>
</node>
<node CREATED="1682588600735" ID="ID_1492815997" MODIFIED="1682665369698" TEXT="Email ID">
<richcontent TYPE="NOTE"><html>
  <head>
    
  </head>
  <body>
    <p>
      Email ID of the User
    </p>
  </body>
</html></richcontent>
</node>
<node CREATED="1682588609666" HGAP="67" ID="ID_811230946" MODIFIED="1682664991754" TEXT="Role" VSHIFT="10">
<richcontent TYPE="NOTE"><html>
  <head>
    
  </head>
  <body>
    <p>
      Role of the User (Super Admin / Admin / Techie / User)
    </p>
  </body>
</html></richcontent>
<node CREATED="1682663238898" ID="ID_577143657" MODIFIED="1682664769170" TEXT="Organization Admin"/>
<node CREATED="1682663215338" ID="ID_1345848979" MODIFIED="1682664765193" TEXT="Techie"/>
<node CREATED="1682663219274" ID="ID_875962174" MODIFIED="1682664762162" TEXT="User"/>
</node>
<node CREATED="1682661080785" HGAP="54" ID="ID_939538567" MODIFIED="1682663284653" TEXT="Status" VSHIFT="27">
<richcontent TYPE="NOTE"><html>
  <head>
    
  </head>
  <body>
    <p>
      Current status of the User: Active / Inactive / Removed
    </p>
  </body>
</html></richcontent>
<node CREATED="1682663286576" ID="ID_1615981660" MODIFIED="1682663291031" TEXT="Active"/>
<node CREATED="1682663295873" ID="ID_1463304268" MODIFIED="1682663306054" TEXT="Inactive"/>
<node CREATED="1682663297730" ID="ID_1060327679" MODIFIED="1682663311262" TEXT="Removed"/>
</node>
<node CREATED="1682662091743" ID="ID_321525515" MODIFIED="1682662144218" TEXT="Last-Login">
<richcontent TYPE="NOTE"><html>
  <head>
    
  </head>
  <body>
    <p>
      Last login timestamp of the User
    </p>
  </body>
</html></richcontent>
</node>
<node CREATED="1682662100357" ID="ID_1749714537" MODIFIED="1682662151933" TEXT="Last-Logout">
<richcontent TYPE="NOTE"><html>
  <head>
    
  </head>
  <body>
    <p>
      Last logout timestamp of the User
    </p>
  </body>
</html></richcontent>
</node>
<node CREATED="1682662107396" ID="ID_1301712337" MODIFIED="1682665511731" TEXT="Actions">
<richcontent TYPE="NOTE"><html>
  <head>
    
  </head>
  <body>
    <p>
      Actions: Edit / Remove the Users panel entries.
    </p>
    <p>
      
    </p>
    <p>
      Super Admin have access to assign Role (Organization Admin / Techie / User) &amp; Status (Active / Inactive);
    </p>
    <p>
      Organization Admin have access to assign Role (Techie / User) &amp; Status (Active / Inactive);
    </p>
    <p>
      First Name / Last Name / Email ID can be created or updated only by the User request;
    </p>
    <p>
      Last-Login / Last-Logout are pulled from the DB as per the User activity;
    </p>
  </body>
</html></richcontent>
<node CREATED="1682663320312" ID="ID_1768055763" MODIFIED="1682663428220" TEXT="Edit">
<icon BUILTIN="male1"/>
</node>
<node CREATED="1682663323371" ID="ID_1636409980" MODIFIED="1682663432020" TEXT="Remove">
<icon BUILTIN="male1"/>
</node>
</node>
</node>
</node>
<node CREATED="1682588252763" HGAP="309" ID="ID_638979833" MODIFIED="1683112012396" TEXT="Spot" VSHIFT="4">
<node CREATED="1682662237971" HGAP="176" ID="ID_1742845879" MODIFIED="1682674543577" TEXT="Add Spot" VSHIFT="20">
<richcontent TYPE="NOTE"><html>
  <head>
    
  </head>
  <body>
    <p>
      Create a New Location for the organization.
    </p>
    <p>
      
    </p>
    <p>
      Organization Admin have the power to create the Location.
    </p>
    <p>
      Super Admin have the power to create and delete the Location.
    </p>
  </body>
</html></richcontent>
<icon BUILTIN="male1"/>
</node>
<node CREATED="1682662260636" HGAP="93" ID="ID_1471528243" MODIFIED="1682674551598" TEXT="Spot Panel">
<richcontent TYPE="NOTE"><html>
  <head>
    
  </head>
  <body>
    <p>
      Node panel displays the Node based information in Table format.
    </p>
  </body>
</html></richcontent>
<node CREATED="1682662275667" ID="ID_536022829" MODIFIED="1682665635051" TEXT="Name"/>
<node CREATED="1682662288101" ID="ID_1764734269" MODIFIED="1682665653475" TEXT="Tag Info"/>
<node CREATED="1682662292229" ID="ID_1277111645" MODIFIED="1682663108169" TEXT="Status">
<node CREATED="1682663124052" ID="ID_1601963922" MODIFIED="1682663126560" TEXT="Active"/>
<node CREATED="1682663127234" ID="ID_815890140" MODIFIED="1682663130079" TEXT="Inactive"/>
</node>
<node CREATED="1682663441186" ID="ID_587471463" MODIFIED="1682665821423" TEXT="Mapped Device HW ID"/>
<node CREATED="1682665673005" ID="ID_443227666" MODIFIED="1682665699384" TEXT="Latitude"/>
<node CREATED="1682665700994" ID="ID_565923671" MODIFIED="1682665705840" TEXT="Longitude"/>
<node CREATED="1682665978690" HGAP="23" ID="ID_412981270" MODIFIED="1682674943772" TEXT="Parameters" VSHIFT="-47">
<richcontent TYPE="NOTE"><html>
  <head>
    
  </head>
  <body>
    <p>
      Parameters tells the data that are collected from the device and the network.
    </p>
  </body>
</html></richcontent>
<node CREATED="1682666038528" ID="ID_863671776" MODIFIED="1682666080168" TEXT="Device Parameters">
<node CREATED="1682666098835" ID="ID_1650122940" MODIFIED="1682666104614" TEXT="Temperature"/>
<node CREATED="1682666105202" ID="ID_1678664082" MODIFIED="1682666108311" TEXT="Pressure"/>
<node CREATED="1682666108842" ID="ID_510679482" MODIFIED="1682666115318" TEXT="Humidiity"/>
<node CREATED="1682666116002" ID="ID_1116900486" MODIFIED="1682666122958" TEXT="Activity"/>
<node CREATED="1682666123635" ID="ID_375763246" MODIFIED="1682666129871" TEXT="Air Quality"/>
<node CREATED="1682666130466" ID="ID_1072874085" MODIFIED="1682666140454" TEXT="Lux"/>
<node CREATED="1682666142171" ID="ID_126985746" MODIFIED="1682666143900" TEXT="..."/>
</node>
<node CREATED="1682666080746" ID="ID_756705889" MODIFIED="1682666089591" TEXT="Network Parameters">
<node CREATED="1682666147883" ID="ID_392588134" MODIFIED="1682666156886" TEXT="RSSI"/>
<node CREATED="1682666157298" ID="ID_573883606" MODIFIED="1682666279166" TEXT="Message count"/>
<node CREATED="1682666279840" ID="ID_1116000694" MODIFIED="1682666287771" TEXT="..."/>
</node>
</node>
</node>
</node>
<node CREATED="1682588259651" HGAP="350" ID="ID_3543782" MODIFIED="1683112001747" TEXT="Devices" VSHIFT="-185">
<node CREATED="1682666407944" ID="ID_1474173329" MODIFIED="1682666919301" TEXT="Add Device">
<node CREATED="1682666920264" ID="ID_1671669672" MODIFIED="1682674809114" TEXT=" (From Main Stock Organization Stock)">
<icon BUILTIN="female1"/>
</node>
<node CREATED="1682666928198" ID="ID_861065481" MODIFIED="1682666967002" TEXT=" (From Organization Stock to Main Stock)">
<icon BUILTIN="male1"/>
</node>
</node>
<node CREATED="1682666428665" ID="ID_1592736381" MODIFIED="1682666913534" TEXT="Remove Device"/>
<node CREATED="1682666982573" HGAP="38" ID="ID_153630150" MODIFIED="1682666999730" TEXT="Device Panel" VSHIFT="35">
<node CREATED="1682666993038" ID="ID_1156549042" MODIFIED="1682667013388" TEXT="HW ID"/>
<node CREATED="1682667117039" ID="ID_659413899" MODIFIED="1682667125572" TEXT="Mapped Node"/>
<node CREATED="1682667142822" ID="ID_193105673" MODIFIED="1682667145476" TEXT="Status"/>
</node>
</node>
<node CREATED="1682588266033" HGAP="332" ID="ID_1742738642" MODIFIED="1683112018411" TEXT="Gateways" VSHIFT="-754">
<node CREATED="1682667170159" ID="ID_1610545426" MODIFIED="1682670911991" TEXT="Add Gateway">
<node CREATED="1682670917489" ID="ID_1974784219" MODIFIED="1682674600160" TEXT="Add Name"/>
<node CREATED="1682670695332" ID="ID_768620402" MODIFIED="1682670709393" TEXT="Add Gateway ID"/>
<node CREATED="1682670710005" ID="ID_1898236071" MODIFIED="1682674649645" TEXT="Add Gateway API Credentials"/>
<node CREATED="1682670878684" ID="ID_1635986698" MODIFIED="1682670902904" TEXT="Add Latitude"/>
<node CREATED="1682670886676" ID="ID_1170276926" MODIFIED="1682670891190" TEXT="Add Longitude"/>
<node CREATED="1682670894556" ID="ID_40368820" MODIFIED="1682674694237" TEXT="Add Gateway Properties">
<node CREATED="1682674697371" ID="ID_1484410708" MODIFIED="1682674705349" TEXT="Technology"/>
<node CREATED="1682674706458" ID="ID_1426473602" MODIFIED="1682674720086" TEXT="Network Provider"/>
</node>
</node>
<node CREATED="1682667183975" ID="ID_1900628789" MODIFIED="1682667190233" TEXT="Remove Gateway"/>
<node CREATED="1682667191054" ID="ID_730916513" MODIFIED="1682667196753" TEXT="Gateway Panel">
<node CREATED="1682674610791" ID="ID_915794516" MODIFIED="1682674616006" TEXT="Gateway Name"/>
<node CREATED="1682667201886" ID="ID_1088550136" MODIFIED="1682667212299" TEXT="Gateway ID"/>
<node CREATED="1682670564350" ID="ID_651902359" MODIFIED="1682670574969" TEXT="Status">
<node CREATED="1682670667732" ID="ID_503217194" MODIFIED="1682670670601" TEXT="Up"/>
<node CREATED="1682670671204" ID="ID_1843577576" MODIFIED="1682670673281" TEXT="Down"/>
</node>
<node CREATED="1682667214374" ID="ID_1071415252" MODIFIED="1682667217978" TEXT="Latitude"/>
<node CREATED="1682667218470" ID="ID_1919788792" MODIFIED="1682667236281" TEXT="Longitude"/>
<node CREATED="1682667360038" ID="ID_1687502055" MODIFIED="1682667419811" TEXT="Technology"/>
<node CREATED="1682667405564" ID="ID_1501956899" MODIFIED="1682667425755" TEXT="Network Provider"/>
</node>
</node>
</node>
</node>
</map>
