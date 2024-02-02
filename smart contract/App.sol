// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 < 0.9.0;

contract App {
    address public owner = payable(msg.sender);

    enum Role {
        Farmer,
        Distributor,
        Vendor,
        Customer
    }

    struct User_Type {
        uint id;
        string name;
        string email;
        Role role;
    }

    struct Farmer_Post {
        uint Farmer_Post_id;
        string img;
        address Farmer_address;
        string Product_name;
        string Product_description;
        uint Product_quantity;
        uint Farmer_price;
        uint status;
    }

    struct Distributor_Post {
        uint Distributor_Post_id;
        uint Farmer_Post_id;
        string img;
        address Distributor_address;
        string Product_name;
        string Product_description;
        uint Product_quantity;
        uint Distributor_price;
        uint status;
        uint transactions_id;
    }

    struct Vendor_Post {
        uint Vendor_Post_id;
        uint Distributor_Post_id;
        string img;
        address Vendor_address;
        string Product_name;
        string Product_description;
        uint Product_quantity;
        uint Vendor_price;
        uint status;
        uint transactions_id;
    }

    struct Transactions {
        uint time;
        string from_name;
        address from;
        string to_name;
        address to;
        uint value;
    }
    mapping(uint => Transactions[]) public Transactions_Mapping;

    uint public User_Type_Counter;
    uint public Farmer_Post_Counter;
    uint public Distributor_Post_Counter;
    uint public Vendor_Post_Counter;

    mapping (address => User_Type) public User_Type_Mapping;

    Farmer_Post[] public Farmer_Post_Array;
    Distributor_Post[] public Distributor_Post_Array;
    Vendor_Post[] public Vendor_Post_Array;

    mapping(address => uint[]) public Distributor_Owned_Product;
    mapping(address => uint[]) public Vendor_Owned_Product;
    mapping(address => uint[]) public Customer_Owned_Product;

    function Register_User_Type(string calldata name, string calldata email, Role role) public {
        require(bytes(User_Type_Mapping[msg.sender].name).length == 0, "You are already registered");
        User_Type memory User_Type1;
        User_Type1.id = User_Type_Counter++;
        User_Type1.name = name;
        User_Type1.email = email;
        User_Type1.role = role;
        User_Type_Mapping[msg.sender] = User_Type1;
    }

    function Farmer_Post_Create(string memory img, string memory Product_name, string memory Product_description, uint Product_quantity, uint Farmer_price) public {
        require(User_Type_Mapping[msg.sender].role == Role.Farmer, "You are not the Farmer");
        Farmer_Post memory Farmer_Post1; 
        Farmer_Post1.Farmer_Post_id = Farmer_Post_Counter++;
        Farmer_Post1.img = img;
        Farmer_Post1.Farmer_address = payable(msg.sender);
        Farmer_Post1.Product_name = Product_name;
        Farmer_Post1.Product_description = Product_description;
        Farmer_Post1.Product_quantity = Product_quantity;
        Farmer_Post1.Farmer_price = Farmer_price;
        Farmer_Post_Array.push(Farmer_Post1);
    }

    function Transfer_to_Farmer(uint Farmer_Post_id) public payable  {
        require(User_Type_Mapping[msg.sender].role == Role.Distributor, "You are not the Distributor");
        payable(Farmer_Post_Array[Farmer_Post_id].Farmer_address).transfer(msg.value);

        Transactions memory newTransaction = Transactions(block.timestamp, string(abi.encodePacked(User_Type_Mapping[msg.sender].name,"(D)")), msg.sender, string(abi.encodePacked(User_Type_Mapping[Farmer_Post_Array[Farmer_Post_id].Farmer_address].name,"(F)")), Farmer_Post_Array[Farmer_Post_id].Farmer_address, msg.value);
        Transactions_Mapping[Farmer_Post_id].push(newTransaction);

        Farmer_Post_Array[Farmer_Post_id].status = 1;
        Distributor_Owned_Product[msg.sender].push(Farmer_Post_id);
    }

    function getFarmerTransactions(uint256 _id) public view returns (Transactions[] memory) {
        return Transactions_Mapping[_id];
    }

    function Remove_From_Owned_Product(uint numberToRemove, uint num) public {
        uint[] storage products;
        if(num == 0) {
            products = Distributor_Owned_Product[msg.sender];
        }else {
            products = Vendor_Owned_Product[msg.sender];
        }

        if(products.length == 1) {
            products.pop();
        }else {
            for (uint i = 0; i < products.length; i++) {
            if (products[i] == numberToRemove) {
                products[i] = products[products.length - 1];
                products.pop();
                break;
            }
        }
        }
    }

    function get_Owned_Properties(address _ownerAddress, uint num) public view returns (uint[] memory) {
        uint[] memory propertyIds;
        if(num == 0) {
            propertyIds = Distributor_Owned_Product[_ownerAddress];
        }else if(num == 1) {
            propertyIds = Vendor_Owned_Product[_ownerAddress];
        } else {
            propertyIds = Customer_Owned_Product[_ownerAddress];
        }
        return propertyIds;
    }

    function Distributor_Post_Create(uint Farmer_Post_id, uint Distributor_price) public {
        require(User_Type_Mapping[msg.sender].role == Role.Distributor, "You are not the Distributor");
        Distributor_Post memory Distributor_Post1;
        Distributor_Post1.Distributor_Post_id = Distributor_Post_Counter++;
        Distributor_Post1.Farmer_Post_id = Farmer_Post_id;
        Distributor_Post1.img = Farmer_Post_Array[Farmer_Post_id].img;
        Distributor_Post1.Distributor_address = msg.sender;
        Distributor_Post1.Product_name = Farmer_Post_Array[Farmer_Post_id].Product_name;
        Distributor_Post1.Product_description = Farmer_Post_Array[Farmer_Post_id].Product_description;
        Distributor_Post1.Product_quantity = Farmer_Post_Array[Farmer_Post_id].Product_quantity;
        Distributor_Post1.Distributor_price = Distributor_price;
        Distributor_Post1.transactions_id = Farmer_Post_id;
        Distributor_Post_Array.push(Distributor_Post1);
        Remove_From_Owned_Product(Farmer_Post_id, 0);
    }

    function Transfer_to_Distributor(uint Distributor_Post_id, uint quantity) public payable  {
        require(User_Type_Mapping[msg.sender].role == Role.Vendor, "You are not the Vendor");
        require(quantity < Distributor_Post_Array[Distributor_Post_id].Product_quantity, "Please enter the correct quantity");
        uint value = quantity * Distributor_Post_Array[Distributor_Post_id].Distributor_price;
        payable(Distributor_Post_Array[Distributor_Post_id].Distributor_address).transfer(value);
        Vendor_Post memory Vendor_Post1;
        Vendor_Post1.Vendor_Post_id = Vendor_Post_Counter;
        Vendor_Post1.Distributor_Post_id = Distributor_Post_id;
        Vendor_Post1.img = Distributor_Post_Array[Distributor_Post_id].img;
        Vendor_Post1.Vendor_address = msg.sender;
        Vendor_Post1.Product_name = Distributor_Post_Array[Distributor_Post_id].Product_name;
        Vendor_Post1.Product_description = Distributor_Post_Array[Distributor_Post_id].Product_description;
        Vendor_Post1.Product_quantity = quantity;
        Vendor_Post1.Vendor_price = Distributor_Post_Array[Distributor_Post_id].Distributor_price;
        Vendor_Post1.transactions_id = Distributor_Post_Array[Distributor_Post_id].transactions_id;
        Vendor_Post1.status = 1;
        Vendor_Post_Array.push(Vendor_Post1);
        Vendor_Owned_Product[msg.sender].push(Vendor_Post_Counter);
        Vendor_Post_Counter++;

        Transactions memory newTransaction = Transactions(block.timestamp, string(abi.encodePacked(User_Type_Mapping[msg.sender].name,"(V)")), msg.sender, string(abi.encodePacked(User_Type_Mapping[Distributor_Post_Array[Distributor_Post_id].Distributor_address].name,"(D)")), Distributor_Post_Array[Distributor_Post_id].Distributor_address, msg.value);
        Transactions_Mapping[Distributor_Post_Array[Distributor_Post_id].transactions_id].push(newTransaction);

        Distributor_Post_Array[Distributor_Post_id].Product_quantity -= quantity;
        if(Distributor_Post_Array[Distributor_Post_id].Product_quantity == 0) {
            Distributor_Post_Array[Distributor_Post_id].status = 1;
        }
    }

    function Vendor_Post_Create(uint Vendor_Post_id, uint Vendor_price) public {
        require(User_Type_Mapping[msg.sender].role == Role.Vendor, "You are not the Vendor");
        Vendor_Post_Array[Vendor_Post_id].Vendor_price = Vendor_price;
        Vendor_Post_Array[Vendor_Post_id].status = 0;
        Remove_From_Owned_Product(Vendor_Post_id, 1);
    }

    function Transfer_to_Vendor(uint Vendor_Post_id, uint quantity) public payable  {
        require(User_Type_Mapping[msg.sender].role != Role.Farmer || User_Type_Mapping[msg.sender].role != Role.Distributor || User_Type_Mapping[msg.sender].role != Role.Vendor, "You are not the Customer");
        require(quantity <= Vendor_Post_Array[Vendor_Post_id].Product_quantity, "Please enter the correct quantity");
        uint value = quantity * Vendor_Post_Array[Vendor_Post_id].Vendor_price;

        uint part1 = (value * 30) / 100;  // 30% of the value
        uint part2 = (value * 10) / 100;  // 10% of the value
        uint part3 = (value * 50) / 100;  // 50% of the value

        payable(owner).transfer(part2);
        payable(Vendor_Post_Array[Vendor_Post_id].Vendor_address).transfer(part3);
        payable(Distributor_Post_Array[Vendor_Post_Array[Vendor_Post_id].Distributor_Post_id].Distributor_address).transfer(part2);
        payable(Farmer_Post_Array[Distributor_Post_Array[Vendor_Post_Array[Vendor_Post_id].Distributor_Post_id].Farmer_Post_id].Farmer_address).transfer(part1);

        Transactions memory newTransaction = Transactions(block.timestamp, string(abi.encodePacked(User_Type_Mapping[msg.sender].name,"(C)")), msg.sender, string(abi.encodePacked(User_Type_Mapping[Vendor_Post_Array[Vendor_Post_id].Vendor_address].name,"(V)")), Vendor_Post_Array[Vendor_Post_id].Vendor_address, msg.value);
        Transactions_Mapping[Vendor_Post_Array[Vendor_Post_id].transactions_id].push(newTransaction);

        Vendor_Post_Array[Vendor_Post_id].Product_quantity -= quantity;
        Customer_Owned_Product[msg.sender].push(Vendor_Post_id);
        if(Vendor_Post_Array[Vendor_Post_id].Product_quantity == 0) {
            Vendor_Post_Array[Vendor_Post_id].status = 1;
        }
    }
}