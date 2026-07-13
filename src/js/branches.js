import { animate } from "motion";
import { createIcons, icons } from "lucide";

const branches = {

    manila:{
        title:"Manila Branch",
        image:"public/images/branch1.png",
        description:"Lorem ipsum dolor sit amet...",
        address:"Suite 305, 3rd Floor, AP Building, Pedro Gil corner F, Agoncillo St, Ermita, Manila, 1000",
        phones:["+63 916 3992 066 (Globe)", "+63 962 938 5411 (Smart)", "+63 63 302 3068 (Landline)"],
        map:"#"
    },

    cagayan:{
        title:"Cagayan De Oro City",
        image:"public/images/branch2.png",
        description:"Lorem ipsum dolor sit amet...",
        address:"No. 82 Door C Gordiel Bldg., Corrales Ave., corner J. R. Borja Street, Cagayan De Oro City",
        phones:["+63 916 3992 066 (Globe)", "+63 962 938 5411 (Smart)", "+63 63 302 3068 (Landline)"],
        map:"#"
    },

    lanao:{
        title:"Lanao Del Norte",
        image:"public/images/branch3.png",
        description:"Lorem ipsum dolor sit amet...",
        address:"Tubod Lanao Branch: Stall no.2, 2F, AAQ Bldg., Crossing Tubod, Lanao Del Norte",
        phones:["+63 916 3992 066 (Globe)", "+63 962 938 5411 (Smart)", "+63 63 302 3068 (Landline)"],
        map:"#"
    },

    agusan:{
        title:"Agusan Del Sur",
        image:"public/images/branch4.png",
        description:"Lorem ipsum dolor sit amet...",
        address:"Bayugan Agusan Del Sur: 2F, QuireQuire Bldg., P-3, Taglatawan, Bayugan City, Agusan Del Sur",
         phones:["+63 916 3992 066 (Globe)", "+63 962 938 5411 (Smart)", "+63 63 302 3068 (Landline)"],
        map:"#"
    },

    cebu:{
        title:"Talisay City, Cebu",
        image:"public/images/branch5.png",
        description:"Lorem ipsum dolor sit amet...",
        address:"Talisay, Cebu: Dor #2 and #3, 2F Gee Ann Square Mall, Nonoc Tabunok, Talisay City, Cebu",
         phones:["+63 916 3992 066 (Globe)", "+63 962 938 5411 (Smart)", "+63 63 302 3068 (Landline)"],
        map:"#"
    }

}

export default function initBranches(){

    createIcons({icons});

    const buttons=document.querySelectorAll(".branch-btn");

    buttons.forEach(button=>{

        button.addEventListener("click",()=>{

            buttons.forEach(btn=>{
                btn.classList.remove("bg-red-50","border-red-200");
            });

            button.classList.add("bg-red-50","border-red-200");

            const data=branches[button.dataset.branch];

            const content=document.getElementById("branch-content");

            animate(content,
            {
                opacity:[1,0],
                x:[0,-20]
            },
            {
                duration:.25
            }).finished.then(()=>{

                document.getElementById("branch-image").src=data.image;
                document.getElementById("branch-title").textContent=data.title;
                document.getElementById("branch-description").textContent=data.description;
                document.getElementById("branch-address").textContent=data.address;

                document.getElementById("branch-phone").innerHTML = data.phones
                .map(phone => `<p>📞 ${phone}</p>`)
                .join("");
                
                document.getElementById("branch-map").href=data.map;

                animate(content,{
                    opacity:[0,1],
                    x:[20,0]
                },{
                    duration:.35
                });

            });

        });

    });

}