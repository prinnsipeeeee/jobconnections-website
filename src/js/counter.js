import { createIcons, icons } from "lucide";

export default function initCounter() {

    createIcons({
        icons
    });

    const counters = document.querySelectorAll(".counter");

    const observer = new IntersectionObserver((entries)=>{

        entries.forEach((entry)=>{

            if(!entry.isIntersecting) return;

            const counter = entry.target;

            const target = Number(counter.dataset.target);

            let current = 0;

            const increment = target / 100;

            function update(){

                current += increment;

                if(current < target){

                    counter.textContent = Math.ceil(current).toLocaleString();

                    requestAnimationFrame(update);

                }else{

                    counter.textContent = target.toLocaleString()+"+";

                }

            }

            update();

            observer.unobserve(counter);

        });

    });

    counters.forEach(counter=>observer.observe(counter));

}