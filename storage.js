const Storage = {

    load(){
        const data = localStorage.getItem("mosqueSettings");
        return data ? JSON.parse(data) : CONFIG;
    },

    save(data){
        localStorage.setItem(
            "mosqueSettings",
            JSON.stringify(data)
        );
    }
};
