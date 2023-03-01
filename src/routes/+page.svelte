<!-- page.svelte -->
<script lang="ts">
    import { _carouselItems } from './+page';
    import { Carousel, CarouselControl, CarouselItem } from 'sveltestrap';
    import {
    DropdownItem,
    DropdownMenu,
    Button,
    Dropdown,
    DropdownToggle
  } from 'sveltestrap';

    let open = false;
    let selectedDEValue = 'GNOME'
    let loaded = false;
    export var images: any[] = []
    let activeIndex = 0;

    function handleDESelect(value) {
      selectedDEValue = value;
      open = false;
    }
  
    async function fetchData() {
      images = []
      loaded = false
      const response = await fetch(`https://www.reddit.com/r/unixporn/search.json?q=` + selectedDEValue + `&restrict_sr=on&include_over_18=on&sort=relevance&t=all&limit=500`);
      const jsonResponse = await response.json();
      let childrenList = jsonResponse["data"]["children"]
      for (let i = 0; i < childrenList.length; i++) {
        let carouselItem = {
          id: i,
          name: childrenList[i]["data"]["title"],
          imageurl: childrenList[i]["data"]["url_overridden_by_dest"],
          href: "http://www.reddit.com" + childrenList[i]["data"]["permalink"]
        }
        images.push(carouselItem)
      }
      console.log(images)
      loaded = true;
    }
  </script>
    

<svelte:head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css">
</svelte:head>

  <div class="flex justify-center">
    <Dropdown class="pr-6">
      <DropdownToggle on:click={() => open = !open}>{selectedDEValue}</DropdownToggle>
      <DropdownMenu bind:open={open}>
        <DropdownItem on:click={() => handleDESelect('GNOME')}>
          GNOME
        </DropdownItem>
        <DropdownItem on:click={() => handleDESelect('KDE')}>
          KDE
        </DropdownItem>
        <DropdownItem  on:click={() => handleDESelect('i3')}>
          i3
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>


    <Button on:click={fetchData} color='success'>Search</Button>
</div>

  {#if loaded}
  <Carousel class="pt-7" {images} bind:activeIndex>
    <div class="carousel-inner">
      {#each images as item, index}
        <CarouselItem class="space-x-4" bind:activeIndex itemIndex={index}>
          <img src={item.imageurl} class="d-block w-100" alt={`${item.title} ${index + 1}`} />
		  <a href={item.href}>Reddit Link</a>
        </CarouselItem>
      {/each}
    </div>
  
    <CarouselControl direction="prev" bind:activeIndex {images} />
    <CarouselControl direction="next" bind:activeIndex {images} />
  </Carousel>
{/if}  



  