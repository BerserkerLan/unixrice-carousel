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

    let openDE = false;
    let openSort = false;
    let selectedDEValue = 'GNOME'
    let selectedSortValue = 'relevance'
    let loaded = false;
    export var images: any[] = []
    let activeIndex = 0;

    function handleDESelect(value) {
      selectedDEValue = value;
      openDE = false;
    }

    function handleSortSelect(value) {
      selectedSortValue = value;
      openSort = true;
    }
  
    async function fetchData() {
      images = []
      loaded = false
      const response = await fetch(`https://www.reddit.com/r/unixporn/search.json?q=` + selectedDEValue + `&restrict_sr=on&include_over_18=on&sort=` + selectedSortValue + `&t=all&limit=500`);
      const jsonResponse = await response.json();
      let childrenList = jsonResponse["data"]["children"]
      for (let i = 0; i < childrenList.length; i++) {
        console.log("event: " + childrenList[i])
        let imageURL = childrenList[i]["data"]["url_overridden_by_dest"]
        if (imageURL.includes('v.redd.it') || imageURL.includes('youtu.be')) {
          continue
        }
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
      <DropdownToggle on:click={() => openDE = !openDE}>{selectedDEValue}</DropdownToggle>
      <DropdownMenu bind:open={openDE}>
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

    <Dropdown class="pr-6">
      <DropdownToggle on:click={() => openSort = !openSort}>{selectedSortValue}</DropdownToggle>
      <DropdownMenu bind:open={openSort}>
        <DropdownItem on:click={() => handleSortSelect('relevance')}>
          relevance
        </DropdownItem>
        <DropdownItem on:click={() => handleSortSelect('hot')}>
          hot
        </DropdownItem>
        <DropdownItem  on:click={() => handleSortSelect('top')}>
          top
        </DropdownItem>
        <DropdownItem  on:click={() => handleSortSelect('new')}>
          new
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>


    <Button on:click={fetchData} color='success'>Search</Button>
</div>

  {#if loaded}
  <Carousel class="pt-7" {images} bind:activeIndex data-interval="false">
    <div class="carousel-inner" data-interval="false">
      {#each images as item, index}
        <CarouselItem class="relative space-x-4" bind:activeIndex itemIndex={index} data-interval="false">
          <div class="relative">
            <img src={item.imageurl} class="d-block w-100" alt={`${item.title} ${index + 1}`} />
          </div>
          <div class="relative">
            <a class="z-40" href={item.href} color='success'>Reddit Link</a>
          </div>
        </CarouselItem>
      {/each}
    </div>
  
    <!-- <CarouselControl direction="prev" bind:activeIndex {images} data-interval="false"/>
    <CarouselControl direction="next" bind:activeIndex {images}data-interval="false" /> -->
  </Carousel>
{/if}  



  