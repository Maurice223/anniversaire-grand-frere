import {
  Component,
  OnInit,
  OnDestroy,
  HostListener
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import confetti from 'canvas-confetti';


interface Photo {
  url: string;
  legende: string;
}


interface MessageLivreDor {
  nom: string;
  message: string;
  date: string;
}


@Component({
  selector: 'app-root',

  standalone: true,

  imports: [
    FormsModule
  ],

  templateUrl: './app.html',

  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {

  /* =========================================================
     INFORMATIONS
  ========================================================= */

  readonly prenomGrandFrere = 'Pierre Togo';

  readonly numeroWhatsapp = '22372169614';


  /**
   * Le Mali est en UTC toute l'année.
   * Cette date correspond donc exactement à :
   *
   * 02 septembre 2026 à 00:00 au Mali.
   */
  readonly dateCible =
    new Date('2026-09-02T00:00:00+00:00');


  /* =========================================================
     COMPTE À REBOURS
  ========================================================= */

  estArrive = false;

  private timerInterval?: ReturnType<typeof setInterval>;

  private celebrationDeclenchee = false;


  jours = '00';

  heures = '00';

  minutes = '00';

  secondes = '00';


  /* =========================================================
     AUDIO
  ========================================================= */

  estEnLecture = false;

  audio!: HTMLAudioElement;


  /* =========================================================
     GALERIE
  ========================================================= */

  photos: Photo[] = [
    {
      url: 'assets/photos/pierre1.jpeg',
      legende: 'Un souvenir précieux ❤️'
    },
    {
      url: 'assets/photos/pierre2.jpeg',
      legende: 'Des moments qu’on n’oublie jamais ✨'
    },
    {
      url: 'assets/photos/pierre3.jpeg',
      legende: 'Toujours avancer avec le sourire 👑'
    },
    {
      url: 'assets/photos/pierre4.jpeg',
      legende: 'Les beaux souvenirs restent pour toujours 📸'
    },
    {
      url: 'assets/photos/pierre5.jpeg',
      legende: 'Une nouvelle année pleine de réussite 💫'
    },
    {
      url: 'assets/photos/pierre6.jpeg',
      legende: 'Joyeux anniversaire Grand Frère 🎂'
    },
    {
      url: 'assets/photos/pierre7.jpeg',
      legende: 'Une histoire remplie de beaux moments ❤️'
    },
    {
      url: 'assets/photos/pierre8.jpeg',
      legende: 'Que de beaux souvenirs à célébrer ✨'
    },
    {
      url: 'assets/photos/pierre9.jpeg',
      legende: 'Des instants simples, mais inoubliables 🥂'
    },
    {
      url: 'assets/photos/pierre10.jpeg',
      legende: 'Toujours une raison de sourire 😊'
    },
    {
      url: 'assets/photos/pierre11.jpeg',
      legende: 'Les souvenirs qui font chaud au cœur ❤️'
    },
    {
      url: 'assets/photos/pierre12.jpeg',
      legende: 'Une belle personne, de beaux souvenirs 👑'
    },
    {
      url: 'assets/photos/pierre13.jpeg',
      legende: 'Que cette nouvelle année soit exceptionnelle 💫'
    },
    {
      url: 'assets/photos/pierre14.jpeg',
      legende: 'Des moments gravés dans nos mémoires 📸'
    },
    {
      url: 'assets/photos/pierre15.jpeg',
      legende: 'Toujours plus loin, toujours plus haut 🚀'
    },
    {
      url: 'assets/photos/pierre16.jpeg',
      legende: 'Une vie remplie de bonheur et de bénédictions 🙏'
    },
    {
      url: 'assets/photos/pierre17.jpeg',
      legende: 'À de nombreux autres souvenirs ensemble ❤️'
    },
    {
      url: 'assets/photos/pierre18.jpeg',
      legende: 'À toi, Grand Frère… Joyeux anniversaire 🎂👑'
    }
  ];


  photoSelectionnee: number | null = null;


  /* =========================================================
     LIVRE D'OR
  ========================================================= */

  livreDor: MessageLivreDor[] = [

    {
      nom: 'Maurice',

      message:
        'Joyeux anniversaire Grand Frère ❤️ Que Dieu te protège, te bénisse et t’accorde encore beaucoup de belles années remplies de bonheur et de réussite.',

      date: '02 septembre 2026'
    }

  ];


  nouveauNom = '';

  nouveauMessage = '';

  erreurLivreDor = '';


  private readonly STORAGE_KEY =
    'pierre-togo-livre-dor';


  /* =========================================================
     INITIALISATION
  ========================================================= */

  ngOnInit(): void {

    this.initialiserAudio();

    this.chargerLivreDor();

    this.mettreAJourCompteARebours();


    /**
     * On continue à vérifier la date toutes les secondes
     * jusqu'à l'arrivée du 2 septembre.
     */

    this.timerInterval = setInterval(() => {

      this.mettreAJourCompteARebours();

    }, 1000);

  }


  /* =========================================================
     DESTRUCTION
  ========================================================= */

  ngOnDestroy(): void {

    if (this.timerInterval) {

      clearInterval(this.timerInterval);

    }


    if (this.audio) {

      this.audio.pause();

      this.audio.src = '';

    }

  }


  /* =========================================================
     AUDIO
  ========================================================= */

  private initialiserAudio(): void {

    this.audio =
      new Audio(
        'assets/audio/happy-birthday.mp3'
      );


    this.audio.loop = true;

    this.audio.volume = 0.55;


    this.audio.addEventListener(
      'ended',
      () => {

        this.estEnLecture = false;

      }
    );


    this.audio.addEventListener(
      'pause',
      () => {

        this.estEnLecture = false;

      }
    );


    this.audio.addEventListener(
      'play',
      () => {

        this.estEnLecture = true;

      }
    );

  }


  async toggleMusique(): Promise<void> {

    if (!this.audio) {

      return;

    }


    if (this.estEnLecture) {

      this.audio.pause();

      return;

    }


    try {

      await this.audio.play();

      this.estEnLecture = true;

    } catch (erreur) {

      /**
       * Certains navigateurs refusent la lecture
       * automatique avant une interaction utilisateur.
       */

      console.warn(
        'Lecture audio bloquée par le navigateur.',
        erreur
      );

      this.estEnLecture = false;

    }

  }


  /* =========================================================
     COMPTE À REBOURS
  ========================================================= */

  mettreAJourCompteARebours(): void {

    const maintenant =
      Date.now();


    const difference =
      this.dateCible.getTime() - maintenant;


    /**
     * L'anniversaire est arrivé.
     */

    if (difference <= 0) {

      this.estArrive = true;


      this.jours = '00';

      this.heures = '00';

      this.minutes = '00';

      this.secondes = '00';


      if (this.timerInterval) {

        clearInterval(
          this.timerInterval
        );

      }


      /**
       * On empêche la célébration
       * de se lancer plusieurs fois.
       */

      if (!this.celebrationDeclenchee) {

        this.celebrationDeclenchee = true;


        setTimeout(() => {

          this.celebrationAutomatique();

        }, 700);

      }


      return;

    }


    /**
     * IMPORTANT :
     *
     * Avant la date cible,
     * la page reste sur le compte à rebours.
     */

    this.estArrive = true;


    const uneSeconde =
      1000;


    const uneMinute =
      uneSeconde * 60;


    const uneHeure =
      uneMinute * 60;


    const unJour =
      uneHeure * 24;


    const jours =
      Math.floor(
        difference / unJour
      );


    const heures =
      Math.floor(
        (difference % unJour) /
        uneHeure
      );


    const minutes =
      Math.floor(
        (difference % uneHeure) /
        uneMinute
      );


    const secondes =
      Math.floor(
        (difference % uneMinute) /
        uneSeconde
      );


    this.jours =
      this.formaterNombre(jours);


    this.heures =
      this.formaterNombre(heures);


    this.minutes =
      this.formaterNombre(minutes);


    this.secondes =
      this.formaterNombre(secondes);

  }


  private formaterNombre(
    valeur: number
  ): string {

    return valeur
      .toString()
      .padStart(2, '0');

  }


  /* =========================================================
     CONFETTIS CLASSIQUES
  ========================================================= */

  lancerConfettis(): void {

    const duree =
      4500;


    const fin =
      Date.now() + duree;


    const animation = () => {

      /**
       * Gauche
       */

      confetti({

        particleCount: 4,

        angle: 60,

        spread: 65,

        startVelocity: 52,

        origin: {
          x: 0,
          y: 0.75
        }

      });


      /**
       * Droite
       */

      confetti({

        particleCount: 4,

        angle: 120,

        spread: 65,

        startVelocity: 52,

        origin: {
          x: 1,
          y: 0.75
        }

      });


      if (Date.now() < fin) {

        requestAnimationFrame(
          animation
        );

      }

    };


    animation();

  }


  /* =========================================================
     FEU D'ARTIFICE
  ========================================================= */

  lancerFeuArtifice(
    duree = 10000
  ): void {

    const fin =
      Date.now() + duree;


    const couleurs = [

      '#f7c968',

      '#fff0a6',

      '#ffffff',

      '#d99a36',

      '#ffdf82'

    ];


    const interval =
      setInterval(() => {

        const tempsRestant =
          fin - Date.now();


        if (tempsRestant <= 0) {

          clearInterval(interval);

          return;

        }


        /**
         * Explosion aléatoire
         */

        confetti({

          particleCount: 90,

          spread: 360,

          startVelocity: 28,

          gravity: 0.85,

          ticks: 100,

          scalar: 0.85,

          colors: couleurs,

          origin: {

            x:
              0.15 +
              Math.random() * 0.7,

            y:
              0.1 +
              Math.random() * 0.35

          }

        });


      }, 650);

  }


  /* =========================================================
     GRANDE CÉLÉBRATION
  ========================================================= */

  grandeCelebration(): void {

    /**
     * Explosion centrale.
     */

    confetti({

      particleCount: 180,

      spread: 130,

      startVelocity: 55,

      origin: {
        y: 0.65
      }

    });


    /**
     * Canon gauche.
     */

    setTimeout(() => {

      confetti({

        particleCount: 120,

        angle: 60,

        spread: 75,

        origin: {
          x: 0,
          y: 0.75
        }

      });

    }, 250);


    /**
     * Canon droit.
     */

    setTimeout(() => {

      confetti({

        particleCount: 120,

        angle: 120,

        spread: 75,

        origin: {
          x: 1,
          y: 0.75
        }

      });

    }, 450);


    /**
     * Dernière explosion.
     */

    setTimeout(() => {

      confetti({

        particleCount: 200,

        spread: 360,

        startVelocity: 32,

        origin: {
          x: 0.5,
          y: 0.35
        }

      });

    }, 1000);

  }


  /* =========================================================
     CÉLÉBRATION À MINUIT
  ========================================================= */

  private celebrationAutomatique(): void {

    /**
     * Grand feu d'artifice de 10 secondes.
     */

    this.lancerFeuArtifice(
      10000
    );


    /**
     * Confettis immédiats.
     */

    this.grandeCelebration();


    /**
     * On tente de démarrer la musique.
     *
     * Attention :
     * Safari / Chrome peuvent bloquer
     * l'autoplay sans interaction utilisateur.
     */

    this.demarrerMusiqueAutomatiquement();

  }


  private async demarrerMusiqueAutomatiquement():
    Promise<void> {

    try {

      await this.audio.play();

      this.estEnLecture = true;

    } catch {

      /**
       * Ce n'est pas une erreur dans ton application.
       *
       * C'est une restriction du navigateur.
       * L'utilisateur pourra cliquer
       * sur le bouton Musique.
       */

      this.estEnLecture = false;

    }

  }


  /* =========================================================
     GALERIE
  ========================================================= */

  ouvrirPhoto(
    index: number
  ): void {

    this.photoSelectionnee =
      index;


    document.body.style.overflow =
      'hidden';

  }


  fermerPhoto(): void {

    this.photoSelectionnee =
      null;


    document.body.style.overflow =
      '';

  }


  photoSuivante(): void {

    if (
      this.photoSelectionnee === null
    ) {

      return;

    }


    this.photoSelectionnee =

      (
        this.photoSelectionnee + 1
      )

      % this.photos.length;

  }


  photoPrecedente(): void {

    if (
      this.photoSelectionnee === null
    ) {

      return;

    }


    this.photoSelectionnee =

      (
        this.photoSelectionnee -
        1 +
        this.photos.length
      )

      % this.photos.length;

  }


  @HostListener(
    'document:keydown',
    ['$event']
  )

  gererClavier(
    event: KeyboardEvent
  ): void {

    if (
      this.photoSelectionnee === null
    ) {

      return;

    }


    if (
      event.key === 'Escape'
    ) {

      this.fermerPhoto();

    }


    if (
      event.key === 'ArrowRight'
    ) {

      this.photoSuivante();

    }


    if (
      event.key === 'ArrowLeft'
    ) {

      this.photoPrecedente();

    }

  }


  /* =========================================================
     SCROLL MESSAGE
  ========================================================= */

  allerAuMessage(): void {

    const section =
      document.getElementById(
        'message-maurice'
      );


    section?.scrollIntoView({

      behavior: 'smooth',

      block: 'start'

    });

  }


  /* =========================================================
     LIVRE D'OR
  ========================================================= */

  ajouterMessageLivreDor(): void {

    this.erreurLivreDor = '';


    const nom =
      this.nouveauNom.trim();


    const message =
      this.nouveauMessage.trim();


    if (!nom) {

      this.erreurLivreDor =
        'Entre ton nom avant de publier.';

      return;

    }


    if (!message) {

      this.erreurLivreDor =
        'Écris un petit message pour Pierre.';

      return;

    }


    if (nom.length > 40) {

      this.erreurLivreDor =
        'Le nom est trop long.';

      return;

    }


    if (message.length > 400) {

      this.erreurLivreDor =
        'Le message ne doit pas dépasser 400 caractères.';

      return;

    }


    const nouveauMessage:
      MessageLivreDor = {

      nom,

      message,

      date:
        this.obtenirDateActuelle()

    };


    this.livreDor.unshift(
      nouveauMessage
    );


    this.sauvegarderLivreDor();


    /**
     * Réinitialisation.
     */

    this.nouveauNom = '';

    this.nouveauMessage = '';


    /**
     * Petite récompense visuelle.
     */

    confetti({

      particleCount: 120,

      spread: 100,

      startVelocity: 35,

      origin: {
        y: 0.75
      }

    });

  }


  private obtenirDateActuelle():
    string {

    return new Intl.DateTimeFormat(
      'fr-FR',
      {

        day: '2-digit',

        month: 'long',

        year: 'numeric'

      }
    ).format(
      new Date()
    );

  }


  initiale(
    nom: string
  ): string {

    const nomNettoye =
      nom.trim();


    if (!nomNettoye) {

      return '?';

    }


    return nomNettoye
      .charAt(0)
      .toUpperCase();

  }


  /* =========================================================
     LOCAL STORAGE
  ========================================================= */

  private sauvegarderLivreDor(): void {

    try {

      localStorage.setItem(

        this.STORAGE_KEY,

        JSON.stringify(
          this.livreDor
        )

      );

    } catch (erreur) {

      console.warn(
        'Impossible de sauvegarder le livre d’or.',
        erreur
      );

    }

  }


  private chargerLivreDor(): void {

    try {

      const sauvegarde =
        localStorage.getItem(
          this.STORAGE_KEY
        );


      if (!sauvegarde) {

        return;

      }


      const messages =
        JSON.parse(
          sauvegarde
        );


      if (
        Array.isArray(messages) &&
        messages.length
      ) {

        this.livreDor =
          messages;

      }

    } catch (erreur) {

      console.warn(
        'Impossible de charger le livre d’or.',
        erreur
      );

    }

  }


  /* =========================================================
     WHATSAPP
  ========================================================= */

  envoyerWhatsapp(): void {

    const texte =

      `🎉 Joyeux anniversaire ${this.prenomGrandFrere} ! 👑

Que Dieu te bénisse, te protège et t'accorde une longue vie remplie de bonheur, de réussite et de belles opportunités. ❤️

Profite pleinement de ta journée ! 🎂✨`;


    const lien =

      `https://wa.me/${this.numeroWhatsapp}` +

      `?text=${encodeURIComponent(texte)}`;


    window.open(

      lien,

      '_blank',

      'noopener,noreferrer'

    );

  }

}
