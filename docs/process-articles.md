# Process : Ajout/Mise à jour d'articles CGI

## Quand l'utilisateur fournit un PDF

### 1. Identifier les articles sur la page

- Lire le PDF et extraire les numéros d'articles visibles
- Ignorer les articles **abrogés** (pas de mots-clés)

### 2. Vérifier l'existence dans les 3 fichiers

Pour chaque article non-abrogé, vérifier sa présence dans :

| # | Fichier                          | Chemin                                          | Format                                                             |
| - | -------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------ |
| 1 | **Chapitre server**        | `server/data/cgi/2026/<tome>-<chapitre>.json` | `{ article, titre, texte[], mots_cles[], statut, section }`      |
| 2 | **Chapitre mobile**        | `mobile/data/<tome>-<chapitre>.json`          | Identique au server                                                |
| 3 | **Articles plat (Qdrant)** | `server/data/articles-2026-<tome>.json`       | `{ numero, titre, contenu, tome, chapitre, keywords[], source }` |

### 3. Si article manquant → Ajouter dans les 3 fichiers

- **Server chapitre** : utiliser `Edit` pour insérer l'article au bon endroit dans le JSON
- **Mobile chapitre** : même modification avec `Edit`
- **Articles plat** : ajouter l'objet dans le fichier `articles-2026-<tome>.json` correspondant

### 4. Si article existant → Vérifier et mettre à jour

- **Contenu / texte** : comparer le texte existant avec le PDF. Si le texte est incomplet ou différent, le mettre à jour dans les 3 fichiers :
  - `texte[]` dans les fichiers chapitres (server + mobile)
  - `contenu` dans le fichier plat articles-2026
- **Mots-clés** : comparer les `mots_cles` / `keywords` avec le contenu du PDF. Ajouter les mots-clés manquants dans les **3 fichiers** avec `Edit`
- **Titre** : vérifier que le titre correspond au PDF, corriger si besoin

### 5. Fichiers plats par tome (pour Qdrant)

| Fichier                            | Tomes                 |
| ---------------------------------- | --------------------- |
| `articles-2026-tome1.json`       | tome `"1"`          |
| `articles-2026-tome2.json`       | tome `"2"`          |
| `articles-2026-tfnc.json`        | tous les `"TFNC*"`  |
| `articles-2026-conventions.json` | tous les `"CONV-*"` |
| `articles-2026-annexes.json`     | `"ANNEXES-1"`       |

## Règles

- Toujours utiliser `Edit` (pas `Write`) pour modifier les fichiers existants
- Les articles abrogés : pas de mots-clés, on les ignore
- Toujours mettre à jour les **3 emplacements** (server chapitre, mobile chapitre, articles plat)

---

# Process : Déploiement

## Ordre strict

1. **Git commit + push** (depuis local)

```bash
cd /home/christelle-mabika/cgi-242
git add <fichiers>
git commit -m "message"
git push origin main
```

2. **SSH sur VPS** : pull

```bash
ssh ubuntu@51.83.75.203 "cd /opt/cgi242 && git pull origin main"
```

3. **Build web** sur VPS

```bash
ssh ubuntu@51.83.75.203 "cd /opt/cgi242/mobile && npm run build:web"
```

4. **Copier dist + rebuild nginx**

```bash
 ssh ubuntu@51.83.75.203 "cd /opt/cgi242 && rm -rf nginx/dist && cp -r mobile/dist nginx/dist && docker compose up -d --build nginx"
```
